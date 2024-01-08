import { Container, Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import CESS from "../lib/CESS";
import Loading from "./loading";

function User() {
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const getUser = async () => {
      const res = await CESS.getAccountInfo();
      setUserInfo(res);
    }
    getUser();
  }, []);

  return (
    <Container>
      {/* <h1 className="text-center">Account Management</h1> */}
      {userInfo ? <Row>
        <Col xs={12} sm={12} md={12}>
          Account Address: {userInfo["address"]}
        </Col>
        <Col xs={12} sm={12} md={12}>
          Total Space: {userInfo["totalSpaceStr"]}
        </Col>
        <Col xs={12} sm={12} md={12}>
          Used Space: {userInfo["usedSpaceStr"]}
        </Col>
        <Col xs={12} sm={12} md={12}>
          Remaining Space: {userInfo["remainingSpaceStr"]}
        </Col>
      </Row>
        : <Loading />}

    </Container>
  );
}

export default User;