import React, { useState, useEffect }  from 'react';
import './Home.css';
import NavbarNew from '../Navbar/Navbar_new';
import viralSrc from '../../assets/images/viral.png';
import sumukh from '../../assets/images/sumukh.jpg';
import dog from '../../assets/images/dog.png';
import rl from '../../assets/images/RL.png';
import gan from '../../assets/images/gan.png';
import gnn from '../../assets/images/gnn.png';
import mentality from '../../assets/images/mentality.png';
import WorkTimelineComponent from '../Work_timeline/Work_timeline';
import EduTimelineComponent from '../Edu_timeline/Edu_timeline';

function Home() {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        const interval = setInterval(() => {
          createShootingStar();
        }, Math.random() * 2000);
    
        return () => clearInterval(interval);
      }, []);
    
      const createShootingStar = () => {
        const star = document.createElement('div');
        star.className = 'shooting-star';
        document.body.appendChild(star);
    
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const destinationX = posX + (Math.random() * 200 - 100);
        const destinationY = posY + (Math.random() * 200 - 100);
    
        star.style.left = `${posX}px`;
        star.style.top = `${posY}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
    
        setTimeout(() => {
          star.style.left = `${destinationX}px`;
          star.style.top = `${destinationY}px`;
          star.style.opacity = 0;
        }, 50);
    
        setTimeout(() => {
          star.remove();
        }, 4000);
      };

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const [offsetY, setOffsetY] = useState(0); 
    const handleScroll = () => {
      const offsetY = window.pageYOffset;
      document.documentElement.style.setProperty('--translateY', `${offsetY * 0.1}px`);
      document.documentElement.style.setProperty('--rotate', `${offsetY * 0.05}deg`);
  };

  useEffect(() => {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, []);
    return (
        <>
        <div className="home-container">
            <NavbarNew />
            <div className={isVisible ? "fullScreenMessage" : "fullScreenMessage hidden"}>
                TAKE THE RISK OR LOSE THE CHANCE.
            </div>
            <div className="text-side">
                <h1 className="welcome_text">Hello, I'm <span className="gradient-text" id='gradient-text'>Sumukh</span></h1>
                <p className="welcome_p">A passionate Machine Learning Engineer looking forward to contribute to cutting-edge AI projects</p>
            </div>
            <div className="image-side">
                <img src={viralSrc} />
            </div>
        </div>
        <img src={dog} alt="Top Right" className="top-right-image-about" id='center-card-about'/> 
        <div className="center-card-about">
          <div className="card-content-about">
              <img src={sumukh} className="card-image-about" />
              <div className="card-text-about">
                <h2 className="h2-card-text-about">OVERVIEW</h2>
                <p className="p-card-text-about">I am a technology enthusiast currently pursuing Masters in Computer Science at San Jose State University. I am a skilled Machine Learning Engineer currently honing my skills as an intern at Inhabitr Inc., in Milpitas, California. Passionate about innovation, I am always eager to meet new people, collaborate, learn and work on new ideas in the realm of AI and Machine Learning.</p>
                <h5 className='p-card-text-about-addn-details'>
                  San Jose, California
                </h5>
              </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className='work-timeline' id='work-timeline'>
          <h2 className='work-timeline-h2'>WORK EXPERIENCE</h2>
          <WorkTimelineComponent /> 
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className='projects' id='projects'>
          <h2 className='edu-timeline-h2'>ACADEMIC PROJECTS</h2>
          <div class="card-grid">
            <div class="card">
              <div class="card__bg">
                <p className='card_bg_p'>Spearheaded the design and execution of experiments to analyze the efficiency of advanced reinforcement learning algorithms like PPO, A3C, SAC, DQN, and SARSA across diverse custom-built game environments</p>
              </div>
              <div class="card__content">
                <p class="card__category">Reinforcement Learning</p>
                <h3 class="card__heading">Impact of RL algorithms on custom game environments</h3>
              </div>
            </div>

            <div class="card">
              <div class="card__bg" >
              <p className='card_bg_p'>Leveraged cutting edge Generative Adversarial Networks and Variational Auto Encoders to create synthetic galactic images. Methodically implemented and evaluated multiple GAN architectures such as CGAN, DCGAN, and WGAN-GP to identify optimal configurations</p>
              </div>
              <div class="card__content">
                <p class="card__category">Generative Adversarial Networks</p>
                <h3 class="card__heading">Synthetic galaxy image generation with Generative Adversarial Networks</h3>
              </div>
            </div>

            <div class="card">
              <div class="card__bg">
                <p className='card_bg_p'>Engineered and deployed a SemiGNN model utilizing TensorFlow-2, focusing on anomaly detection within financial networks, accompanied by a comparative analysis against the state-of-the-art CareGNN model</p>
              </div>
              <div class="card__content">
                <p class="card__category">Graph Neural Networks</p>
                <h3 class="card__heading">GNN based approach for anomaly detection in financial networks</h3>
              </div>
            </div>

            <div class="card">
              <div class="card__bg">
                <p className='card_bg_p'>Led a team of four in design and development of a psychological companion for corporate employees. Included an RNN-based sentiment analysis model for stress management, and architected a MERN-based UI featuring an AI-powered chatbot.</p>
              </div>
              <div class="card__content">
                <p class="card__category">Recurrent Neural Networks</p>
                <h3 class="card__heading">Mentality: Recurrent Neural Network based psychological companion</h3>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div className='edu-timeline' id='edu-timeline'>
          <h2 className='edu-timeline-h2'>EDUCATION</h2>
          <EduTimelineComponent /> 
        </div>

        <div class="footer">
          <p><b>© Sumukh Naveen Aradhya.</b> All Rights Reserved, 2024</p>
        </div>
        </> 
    );
}

export default Home;
