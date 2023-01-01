import { useState} from "react";
import MentionBox from "../components/MentionBox";

export default function Home({ elasticsearchClient }) {
  const [result, setResult] = useState([]); //name,email,label
  const [stored, setStored] = useState(false);

  async function generatePeople() {
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
      // console.log(data.result);
      const employees = data.result.slice(0,Math.floor(data.result.length/2));
      const customers = data.result.slice(Math.floor(data.result.length/2));
      // console.log(employees);
      // console.log(customers);
      employees.trim().split("\n").map(line => {
        const [name, email] = line.split(",");
        setResult(result => [...result, {
          name,
          email,
          label:'employee'
        }])
      });
      customers.trim().split("\n").map(line => {
        const [name, email] = line.split(",");
        setResult(result => [...result, {
          name,
          email,
          label:'customer'
        }])
      });

      await storePeople();
      setStored(true);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function storePeople() {
    const response = await fetch("/api/elastic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    });
    const data = await response.json();
    console.log('from ESS', data);
  }

  return (
    <div>
        <button onClick={generatePeople}>Generate names</button>
        {/* <div>{result && result.map(({name, email, label}) => (
          <div key={email}>
            <p>{`${name}, ${email}, ${label}`}</p>
          </div>
          ))
        }</div> */}
        {stored && <MentionBox/>}
    </div>
  );
}

