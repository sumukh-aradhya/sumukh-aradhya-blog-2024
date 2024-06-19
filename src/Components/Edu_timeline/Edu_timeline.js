import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './Edu_timeline.css';
import SJSU from '../../assets/images/sjsu.png';
import Ramaiah from '../../assets/images/ramaiah.png';

function EduTimelineComponent() {
  return (
    <div>
      <VerticalTimeline>
        <VerticalTimelineElement
          className="vertical-timeline-element--edu"
          contentStyle={{ background: '#11181f', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #11181f' }}
          date="Aug 2023 - present"
          icon={<img className='logo-edu-timeline' src={SJSU} alt="Custom Icon" style={{ width: '50%', height: 'auto', objectFit: 'cover', borderRadius: '10%' }} />}
          iconStyle={{ background: '#fff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <h3 className="vertical-timeline-element-title">Masters in Computer Science</h3>
          <h4 className="vertical-timeline-element-subtitle">San Jose State University</h4>
          <h5 className="vertical-timeline-element-subtitle">San Jose, California</h5>
          <p>
            <b>Related Coursework:</b> Data Structures and Algorithms, Database System Principles, Topics in Machine Learning, Topics in Artificial Intelligence, Machine Learning on Graphs
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--edu"
          contentStyle={{ background: '#11181f', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #11181f' }}
          date="Aug 2017 - July 2021"
          icon={<img src={Ramaiah} alt="Custom Icon" style={{ width: '50%', height: 'auto', objectFit: 'cover', borderRadius: '10%', paddingTop:'5%' }} />}
          iconStyle={{ background: '#fff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <h3 className="vertical-timeline-element-title">Bachelors of Engineering in Computer Science and Engineering</h3>
          <h4 className="vertical-timeline-element-subtitle">Ramaiah Institute of Techonology</h4>
          <h5 className="vertical-timeline-element-subtitle">Bengaluru, India</h5>
          <p>
            <ul>
                <li>Filed a patent in India under the title of “Cognitively Managing Depression Levels in an Individual” <br></br> Application ID: 202141028086</li>
                <li>Published a survey paper titled "A Survey on Game Theory based Interference Mitigation in WBASN" in the International Journal of Sensors, Wireless Communications and Control</li>
                <li>Won the best project award for research and development among final year projects 2020-2021</li>
            </ul>
          </p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
}

export default EduTimelineComponent;
