import { Container, Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";

import CESS from "../lib/CESS";
import Photos from "../components/photos";
import Loading from "./loading";

function Folders(props) {
  let [list, setList] = useState([]);

  useEffect(() => {
    const fetchBucketList = async () => {
      const bucketList = await CESS.listBuckets();
      setList(bucketList);
    }
    fetchBucketList();
  }, []);

  return (
    <Container>
      {list.length > 0 ?
        <Row>
          {list.map((item, idx) => (
            <Col key={idx} className="text-center" onClick={() => {
              props.page(<Photos bucketName={item.key} />, "preview");
            }}>
              <Image className="icon text-center"
                src="folder.png"
              />
              <h6>{item.key}</h6>
            </Col>
          ))}
        </Row>
        : <Loading />
      }
    </Container>
  );
}

export default Folders;