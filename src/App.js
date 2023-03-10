import React, { useEffect, useState } from "react";
import './App.css';
import Tmdb from './Tmdb';
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/featuredMovie";
import Header from "./components/Header";

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [ featuredData, setfeaturedData] = useState(null)
  const [blackHeader, setblackHeader] = useState(false)

  useEffect(()=>{
    const loadAll = async () => {
      // Pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list)

      // Pegando o Featured
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setfeaturedData(chosenInfo);
    }

    loadAll();
  }, []);

  useEffect(()=>{
    const scrollListener = () => {
      if(window.scrollY > 10){
        setblackHeader(true);
      } else{
        setblackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  },[])

  return (
    <div className="page">

      <Header black={blackHeader}/> 

      {featuredData &&
      <FeaturedMovie item={featuredData}/>
      }

      <section className="lists">
        {movieList.map((item, key)=>(
          <div>
            <MovieRow key={key} title={item.title} items={item.items}/>
          </div>
        ))}
      </section>

      <footer>
        Feito com ❤️ pela B7web<br/>
        Direitos de imagens para Netflix<br/>
        Dados pegos do site Themoviedb.org<br/>
        Desenvolvido por Eduardo Henrique
      </footer>
    
      {movieList.length <= 0 &&
      <div className="loading">
        <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="loading"></img>
      </div>
    }
    </div>
  )
}
