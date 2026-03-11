import Header from './Header'
import Main from './Main'
const Hero = () => {
  return (
    <div className="back h-screen relative">
        <div className='absolute  w-full top-0 left-0'>
            <Header/>
            <Main/>
        </div>
    </div>
  )
}

export default Hero