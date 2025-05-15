import React from 'react';
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './Work_timeline.css';
import Inhabitr from '../../assets/images/inhabitr2.jpg';
import Zebra from '../../assets/images/zebra2.jpg';
import SJSU from '../../assets/images/sjsu.png';

function WorkTimelineComponent() {
  return (
    <div>
      <VerticalTimeline>
      <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#11181f', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #11181f' }}
          date="Feb 2025 - May 2025"
          icon={<img className='logo-work-timeline' src={SJSU} alt="Custom Icon" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10%' }} />}
          iconStyle={{ background: '#fff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <h3 className="vertical-timeline-element-title">Graduate Student Assistant</h3>
          <h4 className="vertical-timeline-element-subtitle">San Jose State University</h4>
          <h5 className="vertical-timeline-element-subtitle">San Jose, California</h5>
          <p>
            <ul>
              <li>Assisting Prof. Wendy Lee with an undergrad course <br />CS 122: Advanced Programming with Python</li>
            </ul>
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#11181f', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #11181f' }}
          date="Jun 2024 - Aug 2024"
          icon={<img className='logo-work-timeline' src={Inhabitr} alt="Custom Icon" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10%' }} />}
          iconStyle={{ background: '#fff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <h3 className="vertical-timeline-element-title">Machine Learning Intern</h3>
          <h4 className="vertical-timeline-element-subtitle">Inhabitr, Inc.</h4>
          <h5 className="vertical-timeline-element-subtitle">Milpitas, California</h5>
          <p>
            <ul>
              <li>Development and optimization of models to consolidate ~80 attribute models into a single, efficient model</li>
              <li>Creating a model to remove furniture from an inspiration image and replace it with Inhabitr furniture</li>
              <li>Conducting thorough bug fixes and comprehensive data analysis on existing models and databases to improve system reliability and accuracy</li>
            </ul>
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#11181f', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #11181f' }}
          date="Dec 2021 - Jul 2023"
          icon={<img src={Zebra} alt="Custom Icon" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10%' }} />}
          iconStyle={{ background: '#fff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <h3 className="vertical-timeline-element-title">Software Engineer 1 - Component Lead</h3>
          <h4 className="vertical-timeline-element-subtitle">Zebra Technologies Corp.</h4>
          <h5 className="vertical-timeline-element-subtitle">Bengaluru, India</h5>
          <p>
            <ul>
              <li>Zybot - Component Development and Maintenance</li>
              <ul>
                <li>Python</li>
              </ul>
              <li>Continued work on Machine Learning based prioritization model</li>
              <li>Analysis and approval of features delivered from third party vendor team and Zebra consultants</li>
              <li>Initiated bi-weekly brainstorming sessions to foster knowledge sharing among peers</li>
            </ul>
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#11181f', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #11181f' }}
          date="Jul 2021 - Dec 2021"
          icon={<img src={Zebra} alt="Custom Icon" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10%' }} />}
          iconStyle={{ background: '#fff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <h3 className="vertical-timeline-element-title">Software Engineer 1</h3>
          <h4 className="vertical-timeline-element-subtitle">Zebra Technologies Corp.</h4>
          <h5 className="vertical-timeline-element-subtitle">Bengaluru, India</h5>
          <p>
            <ul>
              <li>Machine Learning based prioritization of Enterprise Mobile Computing related test suites</li>
              <ul>
                <li>Unsupervised ML, Python, React, NodeJS, ExpressJS, PostgreSQL</li>
              </ul>
            </ul>
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: '#11181f', color: '#fff' }}
          contentArrowStyle={{ borderRight: '7px solid  #11181f' }}
          date="Jan 2021 - Jul 2021"
          icon={<img src={Zebra} alt="Custom Icon" style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10%' }} />}
          iconStyle={{ background: '#fff', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <h3 className="vertical-timeline-element-title">Engineering Intern</h3>
          <h4 className="vertical-timeline-element-subtitle">Zebra Technologies Corp.</h4>
          <h5 className="vertical-timeline-element-subtitle">Bengaluru, India</h5>
          <p>
          Conceptualized and developed a POC utilizing unsupervised Machine Learning based prioritization model with an accuracy of 80% to decrease overall execution cycle time
          </p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </div>
  );
}

export default WorkTimelineComponent;
