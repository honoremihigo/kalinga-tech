import React from "react";
import Header from "../components/Header";

function Pricing() {
  return (
    <div>
      <Header title="Pricing Plan" />

      <h1 className="text-4xl capitalize font-bold flex justify-center underline mt-5">
        Abyride Pricing Plan
      </h1>
      <div className="container py-5">
        <div className="row">
          {/* Basic Plan */}
          <div className="col-md-4" style={{ textAlign: "center" }}>
            <div
              className="card shadow-sm border-light rounded"
              style={{ textAlign: "center" }}
            >
              <div className="card-body" style={{ textAlign: "center" }}>
                <h5
                  className="card-title"
                  style={{
                    textAlign: "center",
                    width: "100%",
                    background: "#EAEEF1",
                    borderRadius: "5px",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Base Fare && Minimum fare
                </h5>
                <ul
                  className="list-unstyled"
                  style={{ lineHeight: "4", textAlign: "center" }}
                >
                  <li>
                    <strong>$2.50</strong> (Initial charge for starting a ride)
                  </li>
                </ul>
                <ul
                  className="list-unstyled"
                  style={{ lineHeight: "4", textAlign: "center" }}
                >
                  <li>
                    <strong>$6.00</strong> (Minimum charge for short trips)
                  </li>
                </ul>
                <ul
                  className="list-unstyled"
                  style={{ lineHeight: "4", textAlign: "center" }}
                >
                  <li>
                    <strong>1.5x</strong> (Surge multiplier during high demand)
                  </li>
                </ul>

                <button
                  onClick={() => console.log("Base fare selected")}
                  className="btn btn-primary w-100"
                >
                  SIGN UP
                </button>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="col-md-4" style={{ textAlign: "center" }}>
            <div
              className="card shadow-sm border-light rounded"
              style={{ textAlign: "center" }}
            >
              <div className="card-body" style={{ textAlign: "center" }}>
                <h5
                  className="card-title"
                  style={{
                    textAlign: "center",
                    width: "100%",
                    background: "#2b5f60",
                    color: "white",
                    borderRadius: "5px",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Cost per Mile && Cost per Minute
                </h5>
                <ul
                  className="list-unstyled"
                  style={{ lineHeight: "4", textAlign: "center" }}
                >
                  <li>
                    <strong>$1.75</strong> (Charge based on distance traveled)
                  </li>
                </ul>
                <ul
                  className="list-unstyled"
                  style={{ lineHeight: "4", textAlign: "center" }}
                >
                  <li>
                    <strong>$0.35</strong> (Charge based on time taken for the
                    trip)
                  </li>
                </ul>

                <button
                  onClick={() => console.log("Cost per mile selected")}
                  className="btn btn-primary w-100"
                >
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
          {/* Premium Plan */}
          <div className="col-md-4" style={{ textAlign: "center" }}>
            <div
              className="card shadow-sm border-light rounded"
              style={{ textAlign: "center" }}
            >
              <div className="card-body" style={{ textAlign: "center" }}>
                <h5
                  className="card-title"
                  style={{
                    textAlign: "center",
                    width: "100%",
                    background: "#EAEEF1",
                    borderRadius: "5px",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  Cancellation Fee
                </h5>

                <ul
                  className="list-unstyled"
                  style={{ lineHeight: "4", textAlign: "center" }}
                >
                  <li>
                    <strong>$5.00</strong> (Fee for trip cancellations after
                    acceptance)
                  </li>
                </ul>
                <ul
                  className="list-unstyled"
                  style={{ lineHeight: "4", textAlign: "center" }}
                >
                  <li>
                    <strong>$2.00</strong> (Flat fee covering operational costs)
                  </li>
                </ul>
                <ul
                  className="list-unstyled"
                  style={{ lineHeight: "4", textAlign: "center" }}
                >
                  <li>
                    <strong>$0.35</strong> (Charge based on time taken for the
                    trip)
                  </li>
                </ul>
                <button
                  onClick={() => console.log("Cost per mile selected")}
                  className="btn btn-primary w-100"
                >
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
