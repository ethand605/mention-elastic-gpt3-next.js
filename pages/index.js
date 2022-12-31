import { useState } from "react";
// import styles from "./index.module.css";

export default function Home() {
  const [result, setResult] = useState({});

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      console.log(data);
      const namesNdEmails = {}
      data.result.trim().split("\n").map(line => {
        const [username, email] = line.split(",");
        namesNdEmails[username] = email;
      });
      //edit the result object
      setResult(namesNdEmails);
  
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <main>
        <form onSubmit={onSubmit}>
          <input type="submit" value="Generate names" />
        </form>
        {result && Object.keys(result).map((username, index) => {
          return (
            <div key={index}>
              <p>{username}</p>
              <p>{result[username]}</p>
            </div>
          )
        }
        )}
      </main>
    </div>
  );
}
