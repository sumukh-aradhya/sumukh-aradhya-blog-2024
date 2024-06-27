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
    </div>
</div>


  );
}

export default GalleryComponent;
