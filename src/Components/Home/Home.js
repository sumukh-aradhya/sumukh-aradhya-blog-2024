import React, { useState, useEffect }  from 'react';
import './Home.css';
import NavbarNew from '../Navbar/Navbar_new';
import viralSrc from '../../assets/images/viral.png';
import sumukh from '../../assets/images/sumukh_malay.jpg';
import dog from '../../assets/images/dog.png';
import WorkTimelineComponent from '../Work_timeline/Work_timeline';
import EduTimelineComponent from '../Edu_timeline/Edu_timeline';
import GalleryComponent from '../Gallery/Gallery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import supabase from '../../supabaseClient';


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

  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('sumukhnaveenaradhya@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Hide after 2 seconds
  };

  const [visitCount, setVisitCount] = useState(null);
  useEffect(() => {
    const logVisit = async () => {
      try {
        await supabase.from('visits').insert([
          {
            ip: window?.location?.hostname, // rough proxy
            user_agent: navigator.userAgent
          }
        ]);
      } catch (error) {
        console.error('Visit logging failed:', error);
      }
    };
  
    logVisit();
  }, []);
  

  useEffect(() => {
    const getVisitCount = async () => {
      const { count, error } = await supabase
        .from('visits')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Failed to fetch visit count:', error);
      } else {
        setVisitCount(count);
        console.log('Visit count response:', count, error);
      }
    };

    getVisitCount();
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
                <p className="p-card-text-about">I am a technology enthusiast with a Master's in Computer Science from San Jose State University. I am a skilled Machine Learning Engineer, currently working on various AI tools and solutions at <a href='https://www.onetera.com' target='_blank' rel="noopener noreferrer" className="plain-link">Onetera</a>. Passionate about innovation, I am always eager to meet new people, collaborate, learn and work on new ideas in the realm of AI and Machine Learning.</p>
                <h5 className='p-card-text-about-addn-details'>
                  Los Angeles, California
                </h5>
                {/* Social Icons with Font Awesome */}
                <div className="social-icons">
                  <a href="https://www.linkedin.com/in/sumukh-n-aradhya" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} className="social-icon" />
                  </a>
                  <a href="https://github.com/sumukh-aradhya" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faGithub} className="social-icon" />
                  </a>
                  <span onClick={handleCopyEmail} className="social-icon email-icon" title="Copy email">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                </div>
                {/* Copied Message */}
                {copied && <p className="copied-message">Email copied!</p>}
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
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <GalleryComponent /> 
        </div>


        <div class="footer">
          <p>Bots and brains that've scrolled this far: {visitCount}</p>
          <p><b>© Sumukh Naveen Aradhya.</b> All Rights Reserved, 2025</p>
        </div>
        </> 
    );
}

export default Home;
