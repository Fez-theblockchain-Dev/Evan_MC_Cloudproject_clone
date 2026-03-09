import React from 'react'
import styles from './Dashboard.module.css'
import {useState, useEffect} from 'react'

export default function ProductDemo() {
  return(
    
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to Job-Linker!</h1>
      </header>
      <section className={styles.section}>
        <h2>Revolutionize Your Job Search</h2>
        <p>
          <strong>JobLinker</strong> is a SaaS platform that empowers job seekers to upload their résumés and instantly connect to a live data pipeline of new job listings posted every day.
        </p>
      </section>
      <section className={styles.section}>
        <h3>How It Works</h3>
        <ol>
          <li>
            <strong>Upload Your CV:</strong> Our secure uploader accepts all standard file types.
          </li>
          <li>
            <strong>Smart Keyword Matching:</strong> Our AI scans your résumé and matches you to the latest jobs based on relevant keywords and skills found in your profile.
          </li>
          <li>
            <strong>Stay Updated:</strong> Receive daily updates with new matching jobs as they're posted!
          </li>
        </ol>
      </section>
      <section className={styles.section}>
        <h3>Why Use JobLinker?</h3>
        <ul>
          <li>Save time: No more endless scrolling or manual filtering.</li>
          <li>Stay ahead: Always see the newest jobs relevant to <strong>your</strong> experience.</li>
          <li>Secure & private: Your data is protected by industry-standard security.</li>
        </ul>
      </section>
      <section className={styles.section}>
        <h3>Get Started</h3>
        <p>
          Simply <strong>sign up</strong> and upload your résumé today. JobLinker will do the rest—matching you with the jobs that matter most.
        </p>
      </section>
    </div>

  )
}