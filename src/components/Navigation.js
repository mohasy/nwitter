import React from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGhost, faBell } from "@fortawesome/free-solid-svg-icons";

const Navigation = ( {userObj} ) => 
<nav>
    <ul style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <li>
            <Link to="/" style={{ marginRight: 10 }}>
              <FontAwesomeIcon icon={faBell} color={"#e6c5da"} size="2x" />
          </Link>
        </li>
        <li>
            <Link to="/profile" style={{
              marginLeft: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: 12,
            }}
          >
          <FontAwesomeIcon icon={faGhost} color={"#e6c5da"} size="2x" />
          <span style={{ marginTop: 10 }}>
            {userObj.displayName?userObj.displayName : "User"}'s Profile
          </span>
          </Link>
        </li>
    </ul>
</nav>;
export default Navigation;