import { Mention, MentionsInput } from "react-mentions";
import { useState, useEffect } from "react";

export default function MentionBox(){
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        fetch("/api/elastic",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
          .then((res) => res.json())
          .then((data) => {
            data.forEach(person => {
                if (person['_source']['label']=='employee'){
                    setCustomers(customers => [...customers, {
                        id: person['_id'],
                        name: person['_source']['name'],
                        email: person['_source']['email'],
                    }])
                }else{
                    setEmployees(employees => [...employees, {
                        id: person['_id'],
                        name: person['_source']['name'],
                        email: person['_source']['email'],
                    }])
                }
            })
          });
    }, []);

    return (<>
        
    </>)


}