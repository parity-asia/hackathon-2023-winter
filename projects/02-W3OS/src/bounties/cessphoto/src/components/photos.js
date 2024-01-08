import { Col, Container, Image, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { FileIcon } from 'react-file-icon';

import CESS from "../lib/CESS";
import Loading from "./loading";

function Photos({ bucketName }) {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      const result = await CESS.getBucketItems(bucketName);
      setIsLoading(false);
      console.log(result);
      setPhotos(result);
    };
    if (isLoading) {
      fetchPhotos();
    }
  }, [bucketName, isLoading]);

  const isImage = (fileName) => {
    const extension = fileName.split('.').pop();
    return ['jpg', 'jpeg', 'png', 'gif'].includes(extension);
  }

  return (
    <Container>
      <h1 className="text-center">Bucket: {bucketName}</h1>
      <Row>
        <Col xs={8} sm={8} md={8} >
          <input type="file" className="form-control" onChange={(event) => {
            setFile(event.target.files[0]);
          }} />
        </Col>
        <Col className="text-end" xs={4} sm={4} md={4}>
          <button className="btn btn-md btn-primary" onClick={async () => {
            alert("Uploading...");
            await CESS.upload(bucketName, file);
            alert("Upload completed.");
            setIsLoading(true);
          }}>
            Upload
          </button>
        </Col>
      </Row>
      <Row>
        {isLoading ? <Loading /> : photos.map((item, idx) => (
          <Col key={idx} className="text-center" onClick={async () => {
            alert("Downloading started...");
            await CESS.download(item.fileHash, item.fileName);
            alert("Download completed.");
          }}>
            {
              isImage(item.fileName) ?
                <Image src={`https://d.cess.cloud/${item.fileHash}`} />
                :
                <FileIcon extension={item.fileName.split('.').pop()} />
            }
            <h6>{item.fileName}</h6>
          </Col>
        ))
        }
      </Row>
    </Container>
  )
}

export default Photos;