import { useState } from 'react'
import { api } from '../api/api'
const Home = () => {
    const [url, setUrl] = useState('')
    
      const submitUrl = async (url) => {
        try {
          const resp = await api.post('/shortenUrl', { url })
          console.log(resp.data)
        } catch (e) {
          console.log(e)
        }
      }
    return (
     <>
     <label htmlFor="url">URL</label>
      <input 
        type="text" 
        id="url" 
        value={url} 
        onChange={(e) => setUrl(e.target.value)} 
      />
      <button type="submit" onClick={() => submitUrl(url)}>Shorten URL</button>
     </>
    )
}

export default Home;