import { useState} from "react";
export default function Home({ elasticsearchClient }) {
  const [result, setResult] = useState([]); //name,email,label

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

      // const resp = await fetch("/api/connectAndStore", {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      // const data2 = await resp.json();
      // console.log(data2);

      // const resp2 = await fetch("/api/connectAndStore", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(result),
      // });
      // const data3 = await resp2.json();
      // console.log('from ESS', data3);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function storePeople() {
    const response = await fetch("/api/store", {
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
      <main>
        <button onClick={generatePeople}>Generate names</button>
        <button onClick={storePeople}>Store to ElasticSearch</button>
        {result && result.map(({name, email, label}) => (
          <div key={email}>
            <p>{`${name}, ${email}, ${label}`}</p>
          </div>
        ))
        }
      </main>
    </div>
  );
}

