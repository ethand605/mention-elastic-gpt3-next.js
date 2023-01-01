import { useState} from "react";
import MentionBox from "../components/MentionBox";

export default function Home({ elasticsearchClient }) {
  // const [result, setResult] = useState([]); //name,email,label
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
      console.log(data.result);
      const users = data.result.trim().split("\n");
      const half = Math.floor(users.length / 2);
      
      const userAry = [];
      for (let i = 0; i < users.length; i++){
        const [name, email] = users[i].split(",");
        const label = i < half ? 'employee' : 'customer';
        userAry.push({
          name,
          email,
          label
        });
      }

      console.log(userAry);

      await storePeople(userAry);
      setStored(true);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function storePeople(ary) {
    const response = await fetch("/api/elastic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ary),
    });
    const resp = await response.json();
    // console.log('from ESS', resp);
  }

  return (
    <div>
        <button onClick={generatePeople}>Generate people(may be delayed)</button>
        {stored && <MentionBox/>}
    </div>
  );
}

