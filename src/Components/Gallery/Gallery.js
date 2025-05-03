import React from 'react';
import './Gallery.css';
import grandcanyon from '../../assets/images/grandcanyon.JPEG';
import la from '../../assets/images/la.JPEG';
import lv from '../../assets/images/lv.JPEG';
import deathvalley1 from '../../assets/images/dv1.JPEG';
import deathvalley2 from '../../assets/images/dv2.JPEG';
import deathvalley3 from '../../assets/images/dv3.JPEG';
import arizona from '../../assets/images/ari.JPEG';
import cresent from '../../assets/images/cresent.JPEG';
import sf from '../../assets/images/sf.JPEG';
import sj from '../../assets/images/sj.JPEG';
import reyes from '../../assets/images/ptreyes.JPEG';
import mile from '../../assets/images/17mile.JPEG';
import malay from '../../assets/images/malay.jpg';
import oregon from '../../assets/images/oregon.jpg';
import sandiego from '../../assets/images/sandiego.jpg';
import mcway from '../../assets/images/mcway.jpg';
import bixby from '../../assets/images/bixby.jpg';
import tiburon from '../../assets/images/tiburon.jpg';
import inverness from '../../assets/images/inverness.jpg';
import lavabeds from '../../assets/images/lavabeds.jpg';

function GalleryComponent() {
  return (
    <div class="container">
        <h2 className='gallery-h2'>Snapshots of Serenity <span className='overlay-text-p'>By Sumukh Aradhya</span></h2>
    <div class="img-grid">
        <div class="image-container">
            <img className='gallery_img' src={grandcanyon} alt="Grand Canyon" />
            <span class="overlay-text">Grand Canyon <span className='overlay-text-p'>Arizona</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={la} alt="Los Angeles" />
            <span class="overlay-text">Griffith Observatory <span className='overlay-text-p'>Los Angeles</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={lv} alt="Las Vegas" />
            <span class="overlay-text">Las Vegas <span className='overlay-text-p'>Nevada</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={cresent} alt="Crescent City" />
            <span class="overlay-text">Sequoia National Park <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={deathvalley1} alt="Death Valley 1" />
            <span class="overlay-text">Death Valley <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={deathvalley2} alt="Death Valley 2" />
            <span class="overlay-text">Death Valley <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={deathvalley3} alt="Death Valley 3" />
            <span class="overlay-text">Badwater Basin <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={arizona} alt="Arizona" />
            <span class="overlay-text">Tempe <span className='overlay-text-p'>Arizona</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={sf} alt="San Francisco" />
            <span class="overlay-text">Golden Gate Bridge <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={sj} alt="San Jose" />
            <span class="overlay-text">San Jose <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={mile} alt="17 Mile Drive" />
            <span class="overlay-text">17 Mile Drive <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={reyes} alt="Point Reyes" />
            <span class="overlay-text">Point Reyes <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={malay} alt="Malaysia" />
            <span class="overlay-text">Kilim Geoforest Park <span className='overlay-text-p'>Malaysia</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={oregon} alt="Oregon" />
            <span class="overlay-text">Manzanita Lake <span className='overlay-text-p'>Oregon</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={sandiego} alt="San Diego" />
            <span class="overlay-text">Torrey Pines Reserve <span className='overlay-text-p'>San Diego</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={mcway} alt="McWay" />
            <span class="overlay-text">McWay Falls <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={bixby} alt="Bixby" />
            <span class="overlay-text">Bixby Bridge <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={tiburon} alt="Tiburon" />
            <span class="overlay-text">Belvedere Tiburon <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={inverness} alt="Inverness" />
            <span class="overlay-text">Inverness <span className='overlay-text-p'>California</span></span>
        </div>
        <div class="image-container">
            <img className='gallery_img' src={lavabeds} alt="Lava Beds" />
            <span class="overlay-text">Lava Beds National Monument <span className='overlay-text-p'>California</span></span>
        </div>
    </div>
</div>


  );
}

export default GalleryComponent;
