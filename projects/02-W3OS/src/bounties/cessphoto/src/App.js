import { useEffect, useState } from "react";
import Nav from "./components/header";
import Folders from "./components/folders";
import Loading from "./components/loading";

function App() {

  let [ content, setContent] = useState("");
  let [ home, setHome] = useState(true);
  let [ way, setWay] = useState("file");

  //1.control the whole action here.
  const self={
    page:(ctx,action,force)=>{
      if(ctx==="home"){
        if(force){
          setContent(<Loading />);
          setTimeout(()=>{
            setContent(<Folders page={self.page}/>);
            setHome(true);
            setWay("file");
          },500);
        }else{
          setContent(<Folders page={self.page}/>);
          setHome(true);
          setWay("file");
        }
      }else{
        setContent(ctx);
        setHome(false);
        if(action) setWay(action); //2.set toolbar way
      }
    },
  }

  useEffect(() => {
    self.page("home");
  }, []);

  return (<div>
    <Nav home={home} page={self.page}/>
    {content}
  </div>);
}

export default App;