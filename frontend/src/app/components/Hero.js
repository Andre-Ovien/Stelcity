import Header from "./Header"
import Main from "./Main"

const Hero = () => {
  return (
    <div className="back min-h-screen w-full relative flex flex-col">
      <Header />
      <div className="flex-1 flex items-center">
        <Main />
      </div>
    </div>
  )
}

export default Hero