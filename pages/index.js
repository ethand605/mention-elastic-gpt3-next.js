import { useState, useEffect } from "react";



export default function Home({ elasticsearchClient }) {
  const [result, setResult] = useState([]); //name,email,label

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
      console.log(data.result);
      const employees = data.result.slice(0,Math.floor(data.result.length/2));
      const customers = data.result.slice(Math.floor(data.result.length/2));
      console.log(employees);
      console.log(customers);
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
      console.log(result);
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

