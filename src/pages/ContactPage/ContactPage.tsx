import Logo from '../../components/Logo/Logo'
import ContactForm from '../../components/ContactForm/ContactForm'
import styles from './ContactPage.module.css'

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Logo />
      </header>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.heading}>
            Interested in our<br />business pricing?
          </h1>
          <p className={styles.subheading}>
            Fill out the form to view details and we'll<br />
            contact you as soon as possible.
          </p>
        </div>

        <ContactForm />
      </main>
    </div>
  )
}
