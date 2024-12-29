import styles from './blog.module.css';
import { motion } from 'framer-motion';
import { useContext, useEffect, useState } from 'react';
import axiosRequest from '../../services/axios/axiosRequest';
import { useNavigate, useParams } from 'react-router';
import { SlClock } from "react-icons/sl";
import Loading from '../../components/loading/Loading';
import AppContext from '../../contexts/AppContext';

export default function Blog() {

  const { fullScreen } = useContext(AppContext);
  const params = useParams();
  const navigateTo = useNavigate();
  const [blog, setBlog] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const blogController = new AbortController();
    axiosRequest.get(`/blogs/${params.id}`, { signal: blogController.signal })
      .then(res => setBlog(res.data))
      .catch(err => { if (err?.response?.status === 404) navigateTo('/') })
      .finally(() => setIsLoading(false));
    return () => blogController.abort();
  }, []);

  function dateFormatter(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    const longDate = date.toLocaleDateString("en-US", options);
    return longDate;
  }

  return (
    <motion.div className={fullScreen ? 'fullScreen_page_container' : 'page_container'}
      initial={{ y: '-100%', rotateZ: -10 }}
      animate={{ y: ['-100%', '0', '-30%', '0', '-15%', '0', '-3%', '0'], rotateZ: [-10, 10, -6, 4, -2, 1, 0, 0], transition: { duration: 1.3, ease: 'easeInOut' } }}
      exit={{ rotateZ: 90, transformOrigin: '0 0 -200px', opacity: [1, 1, 1, 0.5, 0], transition: { duration: 0.7, ease: 'easeIn' } }}
    >
      {isLoading ? <Loading /> :
        <div className={styles.blog_container}>
          <img className={styles.blogImage} src={blog.photo ?? '/asstes/images/noImage.jpg'} alt={blog.title} />
          <div className={styles.blogContent_container}>
            <strong className={`${styles.blogTitle} title`}>{blog.title}</strong>
            <p className='desc'>{blog.description}</p>
            <div className={`${styles.blogInfos} desc`}>
              <SlClock className='fs-6 me-2' />
              {dateFormatter(blog.created_at)}
            </div>
          </div>
        </div>
      }
    </motion.div>
  )
}

