// src/components/Team.jsx
import React, { useEffect } from 'react';
import './Team.css';

const Team = () => {
  // Initialize WOW.js when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const WOW = window.WOW;
      if (WOW) {
        new WOW().init();
      }
    }
  }, []);
  // Static team members data with default profile pictures
  const teamMembers = [
    {
      id: 1,
      name: "Ahmed Bousseta",
      role: "Chef d'équipe",
      description: "Expert en gestion de projet et développement backend",
      image: "team-1.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      id: 2,
      name: "Sara Amrani",
      role: "Designer UX/UI",
      description: "Spécialiste en expérience utilisateur et design d'interface",
      image: "team-2.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      id: 3,
      name: "Youssef Berrada",
      role: "Développeur Full-Stack",
      description: "Expert en technologies React et Laravel",
      image: "team-3.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      id: 4,
      name: "Laila Tadri",
      role: "Data Scientist",
      description: "Spécialiste en analyse de données et intelligence artificielle",
      image: "team-4.jpg",
      social: {
        facebook: "#",
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    }
  ];

  return (
    <section className="team-section container-xxl py-5" id="team">
      <div className="container">
        <div className="text-center wow fadeInUp" data-wow-delay="0.1s">
          <h6 className="section-title bg-white text-center text-primary px-3">Notre Équipe</h6>
          <h1 className="mb-5">Experts Passionnés</h1>
        </div>
        
        <div className="row g-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay={`0.${member.id}s`}>
              <div className="team-item bg-light rounded overflow-hidden">
                <div className="team-img position-relative overflow-hidden">
                  <img className="img-fluid" src={`/img/${member.image}`} alt={member.name} />
                  <div className="team-social">
                    <a className="btn btn-square" href={member.social.facebook}><i className="fab fa-facebook-f"></i></a>
                    <a className="btn btn-square" href={member.social.twitter}><i className="fab fa-twitter"></i></a>
                    <a className="btn btn-square" href={member.social.instagram}><i className="fab fa-instagram"></i></a>
                    <a className="btn btn-square" href={member.social.linkedin}><i className="fab fa-linkedin-in"></i></a>
                  </div>
                </div>
                <div className="text-center p-4">
                  <h5 className="mb-0">{member.name}</h5>
                  <small>{member.role}</small>
                  <p className="team-description mt-2">{member.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
