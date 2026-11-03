import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { FloatingBlobatar } from './components/FloatingBlobatar'
import { technologies } from './data/technologies'
import type { CareerItem, EducationItem, Language, Project } from './data/types'
import './App.css'

type ProfileTranslation = {
  name: string
  role: string
  location: string
  headline: string
  bio: string
  availability: string
  email: string
  phone: string
  whatsappLink: string
  github: string
  linkedin: string
  calendar: string
}

function App() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const profile = t('profile', { returnObjects: true }) as ProfileTranslation
  const projects = t('projects.items', { returnObjects: true }) as Project[]
  const career = t('career.items', { returnObjects: true }) as CareerItem[]
  const education = t('education.items', { returnObjects: true }) as EducationItem[]
  const languages = t('about.languages', { returnObjects: true }) as Language[]

  return (
    <>
      <header className="site-header">
        <a className="logo" href="#">
          Portfolio
        </a>
        <nav aria-label={t('nav.about')}>
          <a href="#about">{t('nav.about')}</a>
          <a href="#projects">{t('nav.projects')}</a>
          <a href="#technologies">{t('nav.technologies')}</a>
          <a href="#career">{t('nav.career')}</a>
          <a href="#education">{t('nav.education')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </nav>
        <div className="lang-switcher" role="group">
          <button
            aria-pressed={i18n.language === 'es'}
            onClick={() => i18n.changeLanguage('es')}
            type="button"
          >
            {t('lang.es')}
          </button>
          <button
            aria-pressed={i18n.language === 'en'}
            onClick={() => i18n.changeLanguage('en')}
            type="button"
          >
            {t('lang.en')}
          </button>
        </div>
      </header>

      <FloatingBlobatar />

      <main>
        <section id="hero" className="section hero">
          <div className="hero-content">
            <p className="eyebrow">{profile.role}</p>
            <h1>{profile.name}</h1>
            <p className="hero-location">{profile.location}</p>
            <p className="hero-tagline">{t('hero.headline')}</p>
            <ul className="hero-links">
              {profile.github && (
                <li>
                  <a href={profile.github} rel="noreferrer" target="_blank">
                    GitHub ↗
                  </a>
                </li>
              )}
              {profile.linkedin && (
                <li>
                  <a href={profile.linkedin} rel="noreferrer" target="_blank">
                    LinkedIn ↗
                  </a>
                </li>
              )}
              <li>
                <a href={profile.whatsappLink}>{t('hero.whatsapp')}</a>
              </li>
            </ul>
          </div>
        </section>

        <section id="about" className="section">
          <p className="section-number">{t('about.section')}</p>
          <h2>{t('about.title')}</h2>
          <div className="about-grid">
            <div>
              <p className="lead">{t('about.lead')}</p>
              <p>{t('about.bio')}</p>
            </div>
            <div className="about-card">
              <p className="status">{t('about.status')}</p>
              <p>{t('about.availability')}</p>
              <p>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
              <p>
                <a href={profile.whatsappLink}>{profile.phone}</a>
              </p>
              <div className="languages">
                <p className="status">{t('about.languagesTitle')}</p>
                <ul>
                  {languages.map((lang) => (
                    <li key={lang.name}>
                      {lang.name}: {lang.level}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <p className="section-number">{t('projects.section')}</p>
          <h2>{t('projects.title')}</h2>
          <div className="cards">
            {projects.map((project) => (
              <article className="card" key={project.id}>
                <p className="card-meta">
                  {project.number} // {project.client}
                </p>
                <h3>
                  {project.link ? (
                    <a href={project.link} rel="noreferrer" target="_blank">
                      {project.title} ↗
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p>{project.summary}</p>
                <p>
                  <strong>{t('projects.roleLabel')}:</strong> {project.role}
                </p>
                <p>
                  <strong>{t('projects.periodLabel')}:</strong> {project.period}
                </p>
                {project.bullets && (
                  <ul className="bullet-list">
                    {project.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
                <ul className="tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="technologies" className="section">
          <p className="section-number">{t('technologies.section')}</p>
          <h2>{t('technologies.title')}</h2>
          <ul className="tags big">
            {technologies.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </section>

        <section id="career" className="section">
          <p className="section-number">{t('career.section')}</p>
          <h2>{t('career.title')}</h2>
          <ol className="timeline">
            {career.map((item) => (
              <li className="timeline-item" key={item.title + item.period}>
                <span className="timeline-year">{item.year}</span>
                <div>
                  <p className="timeline-period">
                    {item.period} · {item.company}
                  </p>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <ul className="bullet-list">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="education" className="section">
          <p className="section-number">{t('education.section')}</p>
          <h2>{t('education.title')}</h2>
          <div className="cards">
            {education.map((item) => (
              <article className="card" key={item.degree}>
                <h3>{item.degree}</h3>
                <p>{item.school}</p>
                <p className="card-meta">{item.year}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <p className="section-number">{t('contact.section')}</p>
          <h2>{t('contact.title')}</h2>
          <p className="lead">{t('contact.lead')}</p>
          <p>{t('contact.availability')}</p>
          <div className="contact-actions">
            <a className="button" href={profile.whatsappLink}>
              {t('contact.ctaWhatsapp')}
            </a>
            <a className="button" href={`mailto:${profile.email}`}>
              {t('contact.ctaEmail')}
            </a>
          </div>
          <p>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </p>
          <p>
            <a href={profile.whatsappLink}>{profile.phone}</a>
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          © {new Date().getFullYear()} {profile.name}. {t('footer')}
        </p>
      </footer>
    </>
  )
}

export default App
