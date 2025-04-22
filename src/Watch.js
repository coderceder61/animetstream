import React ,{forwardRef,useState,useEffect,useRef} from 'react'
import { Link, useParams } from 'react-router-dom';
import Plyr from 'plyr';
import axios from 'axios'
import './Watch.css';
import Nav from './Nav'
import Cookies from 'js-cookie';
import Hls from 'hls.js';

const pageSize = 10; // Number of items per page

const Watch = forwardRef((props, ref) => {

const track = useRef(null);

	const fetchEpisodeSources = async (episodeId) => {
	setSpinner(true)
	//console.log(episodeId)	
	try {
   
const response2 = await axios.post('https://proxy-production-ddb5.up.railway.app/fetch-url',{url:`https://anime-alpha-indol.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${episodeId}&server=hd-1&category=sub`});

console.log(response2);
      const videoUrl = "https://hianimeproxy-production.up.railway.app/m3u8-proxy?url=" + response2.data.content.data.sources[0].url;
		const encodedURL = encodeURIComponent(response2.data.content.data.tracks[0].file);
const proxyURL = `/api/subtitle?url=${encodedURL}`;

track.current.src = proxyURL

		
      if (Hls.isSupported()) {
        let hls = new Hls();
        hls.loadSource(videoUrl);
        hls.attachMedia(videoRef.current);
        setSpinner(false);
        
      } else {
        // Fallback to native video
        if (videoRef.current) {
          videoRef.current.src = videoUrl;
          videoRef.current.play().catch(err => console.error("Error trying to play the video:", err));
        }
      }
    } catch (error) {
      console.error('Error fetching video sources:', error);
    }
  };

	
const hlsRef = useRef(null);

let response 
let res
  let { animeId } = useParams();
        Cookies.set('lastWatchedAnime', animeId);
  //const videoRef = useRef(null);
const player = new Plyr('#player');

  const [animeid,setAnimeId] = useState(0)
  const defaultOptions = {};
  const [isLoading,setSpinner] = useState(true)
  const videoRef = useRef(null);
  const spinnerRef = useRef(null)
  const [title,setTitle] = useState('')
  const [poster,setPoster] = useState('')
	
  const [episodeNumber,setEpisodeNumber] = useState()
  const [totalEpisodes,setTotalEpisodes] = useState([])
  const [episodes,setEpisodes] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const [totalPages, settotalPages] = useState(0);
  //const [totalEpisodes, settotalEpisodes] = useState();
  const [startIndex,setStartIndex] = useState(0)
  const [endIndex,setEndIndex] = useState(0)
  const [currentItems,setcurrentItems] = useState([])
  const [episodeId,setEpisodeId] = useState('')
  
  useEffect(()=>{
    if(isLoading){
      videoRef.current.style.display = "none"
      spinnerRef.current.style.display = "block"

    }else{
      videoRef.current.style.display = "block"
      spinnerRef.current.style.display = "none"

    }
  },[isLoading])
  useEffect(() => {
    async function fetchData() {
      res = await axios.get(`https://proxy-ryan.vercel.app/cors?url=https://anime-alpha-indol.vercel.app/api/v2/hianime/anime/${animeId}`);
    //console.log(res)
    setPoster(res.data.data.anime.info.poster)
    setTitle(res.data.data.anime.info.name)
    setEpisodeNumber(1)
    }
    fetchData();
  }, [animeId]); // Or [] if effect doesn't need props or state
 
  const spinnerTrue = ()=>{
    setSpinner(true)
  }
   const renderPagination = () => {
    const pages = [];
    // for (let i = 1; i <= totalPages; i++) {
    //   pages.push(
    //     <button className='btn_pag' key={i} onClick={() => handlePageChange(i)}>
    //       {i}
    //     </button>
    //   );
    // }
    return <>
    <button className='btn_pag'  onClick={() => handlePageChange(currentPage-1)}>
          <i class="fa-solid fa-arrow-left"></i>
        </button>
      <button className='btn_pag'  onClick={() => handlePageChange(currentPage+1)}>
      <i class="fa-solid fa-arrow-right"></i>
         </button>
    
    </>;
  };



  useEffect(() => {
    let hls
    const fetchEpisodes = async () => {
      try {
        const response = await axios.get(`https://proxy-ryan.vercel.app/cors?url=https://anime-alpha-indol.vercel.app/api/v2/hianime/anime/${animeId}/episodes`);
        //console.log(response);
        const episodeData = response.data.data.episodes;
        setEpisodes(episodeData);
        setTotalEpisodes(episodeData.length);

        // Fetch episode sources (post request)
        
const response2 = await axios.post('https://proxy-production-ddb5.up.railway.app/fetch-url', {url:`https://anime-alpha-indol.vercel.app/api/v2/hianime/episode/sources?animeEpisodeId=${episodeData[0].episodeId}&server=hd-1&category=sub`});
        console.log(response2);

        const videoUrl = "https://hianimeproxy-production.up.railway.app/m3u8-proxy?url=" + response2.data.content.data.sources[0].url;
        //console.log("Video URL: ", videoUrl);
const encodedURL = encodeURIComponent(response2.data.content.data.tracks[0].file);
const proxyURL = `/api/subtitle?url=${encodedURL}`;

track.current.src = proxyURL

        if (Hls.isSupported()) {
          hls = new Hls();
          hlsRef.current = hls;
          hls.loadSource(videoUrl);
          hls.attachMedia(videoRef.current);
          setSpinner(false);
        } else {
          // Fallback to native video if HLS is not supported
          if (videoRef.current) {
            videoRef.current.style.display = "block";
            videoRef.current.src = videoUrl;
            videoRef.current.play().catch(err => {
              console.error("Error trying to play the video (native):", err);
            });
            setSpinner(false);
          }
        }
      } catch (error) {
        console.error('Error fetching episodes or video sources:', error);
      }
    };

    fetchEpisodes();

    // Cleanup: Destroy HLS instance if present when the component unmounts
    return () => {
      hls.destroy();
    };
  }, [animeId]); // Dependency array includes animeId
  useEffect(() => {
    if (totalEpisodes > 0) {
            if(currentPage<1){
        setCurrentPage(1)
      }
     
  
      if(currentPage>totalPages)
        {
          setCurrentPage(totalPages)
     
      }
     

      settotalPages(Math.ceil(totalEpisodes / pageSize));
      setStartIndex((currentPage - 1) * pageSize)
      
      setEndIndex(Math.min(startIndex + pageSize, totalEpisodes))
      setcurrentItems(episodes.slice(startIndex,endIndex))
    }
  }, [totalEpisodes,animeId,currentPage,startIndex,endIndex]);
  useEffect(() => {
    //console.log(episodeId)
  }, [episodeId]);






    const [visible,setVisible] = useState(true)
    const handleClick =()=>{
      setVisible(false)
    }
  return (
    <>

    <Nav pp={props.hj} forwardedRef={ref} spinner={spinnerTrue}/>
   {visible && <div style={{ position:'relative',justifyContent:'space-between', backgroundColor:'rgb(51, 50, 50)',color:'white', padding:'10px 10px'}} >
      <i className="fa-solid fa-hand-holding-dollar"></i> Support
      <span ><a target='_blank' style={{backgroundColor:'black',padding:'0px 10px',color:'white',textDecoration:'none',position:'absolute',right:'20px',marginRight:'10px'}} href='https://ko-fi.com/codercoder61'>Support</a><span 
  style={{cursor:'pointer',color:'white',position:'absolute',right:'10px',bottom:'8px',fontSize:'20px'}} onClick={handleClick}>X</span></span>
  </div>}
  <div className="containerr">

         

	  <video src="" id="player" ref={videoRef} controls>
	  <track
        src=""
ref={track}
        kind="subtitles"
        srcLang="en"
        label="English"
        default
      />
	</video>
         
          <div ref={spinnerRef} className="spinner-container">
            <div className="spinner"></div>
          </div>

  
  <div id="episodeDetails">
    <div style={{display:'flex',flexDirection:'column',alignItems:'start'}}>
      {title?<span >{title}</span>:""}
      <span style={{color:'rgb(161,161,170'}}>Episode {episodeNumber} </span>
    </div>
  </div>
  
  
    <div id="eps" style={{marginTop:'20px',display:'flex',flexDirection:'column',flex:'1',alignItems:'center',flexWrap:'wrap',justifyContent:'center'}}>
    <div  style={{marginBottom:'20px'}}>
        {(totalPages>1 && totalEpisodes>10 )? renderPagination() : ""}
      </div>
      <div style={{display:'flex',flexWrap:'wrap',justifyContent:"center"}}>
    {
  currentItems.length > 0 ? (
    currentItems.map((episode) => (
      <div key={episode.id} onClick={()=>{fetchEpisodeSources(episode.episodeId);setEpisodeId(episode.id);setEpisodeNumber(episode.number);}} style={{display:'flex',flexDirection:'column'}}>
      <img style={{cursor:'pointer',borderRadius:'10px',marginRight:'15px',width:'150px',aspectRatio:'16/9',objectFit:'cover'}} src={poster} alt={episode.title ? episode.title:""} /><span style={{alignSelf:'start',color:'white'}}>{episode.title ? (episode.title.length>19 ? episode.title.slice(0, 16)+'...':episode.title) : "Episode "+episode.number}</span>
	</div>
    ))
  ) : (
    ""
  )
}
</div>
    </div>
  </div>

  
    </>
  )
})

export default Watch
