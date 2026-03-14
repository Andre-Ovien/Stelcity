import Header from "./Header"
import Main from "./Main"

const Hero = () => {
  return (
    <div className="back min-h-screen w-full relative">
      <div className="absolute top-0 left-0 w-full z-20">
        <Header />
      </div>
      <div className="pt-25">
        <Main />
      </div>

    </div>
  )
}

export default Hero