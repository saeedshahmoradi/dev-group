import { motion } from 'framer-motion';
import styles from './members.module.css';
import { useContext, useEffect, useState } from 'react';
import axiosRequest from '../../services/axios/axiosRequest';
import PageTitle from '../../components/pageTitle/PageTitle';
import { Link } from 'react-router';
import { IoCallSharp } from "react-icons/io5";
import Loading from '../../components/loading/Loading';
import AppContext from '../../contexts/AppContext';
import { Helmet } from 'react-helmet-async';
import { formatPhoneNumber } from '../../utils';

export default function Members() {

  const { fullScreen } = useContext(AppContext);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const membersController = new AbortController();
    axiosRequest.get('/members/', { signal: membersController.signal })
      .then(res => setMembers(res.data))
      .catch(err => console.log(err))
      .finally(() => setIsLoading(false));
    return () => membersController.abort();
  }, []);

  return (
    <>
      <Helmet>
        <title>Development Team Members - Metavia</title>
        <meta name="description" content="Meet the brilliant minds behind our projects! Our Development Team combines creativity and expertise to build innovative solutions." />
      </Helmet >

      <div style={{ height: '100%', perspective: '400px' }}>
        <motion.div className={fullScreen ? 'fullScreen_page_container' : 'page_container'}
          initial={{ x: '-100%', scale: 0.7 }}
          animate={{ scale: [0.7, 0.7, 1], x: ['-100%', '50%', '50%'], translateX: [0, '-50%', '-50%'] }}
          exit={{ scale: [1, 0.7, 0.7], x: ['50%', '50%', '100%'], translateX: ['-50%', '-50%', 0] }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {isLoading ? <Loading /> :
            <>
              <PageTitle title='Members' />

              <div className={styles.members_container}>
                {members.map(({ id, slug, photo, full_name, role, phone }) =>
                  <Link to={`/resume/${slug}`} className={styles.card} key={id}>
                    <img className={styles.photo} src={photo ?? '/assets/images/noProfile.gif'} alt={full_name} />
                    <h2 className={`${styles.fullName} h5`}>{full_name}</h2>
                    <h3 className={styles.role}>{role}</h3>
                    <div className='d-flex gap-2 align-items-center desk mt-3'>
                      {phone && <IoCallSharp className='fs-6' />}
                      <p>{formatPhoneNumber(phone)}</p>
                    </div>
                  </Link>
                )}
              </div>
            </>
          }
        </motion.div>
      </div>
    </>
  )
}