import { Mention, MentionsInput } from "react-mentions";
import { useState, useEffect } from "react";

export default function MentionBox(){
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [value, setValue] = useState('');

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
                if (person['_source']['type']=='employee'){
                    setCustomers(customers => [...customers, {
                        id: person['_id'],
                        name: person['_source']['name'],
                        email: person['_source']['email'],
                        type: 'employee'
                    }])
                }else{
                    setEmployees(employees => [...employees, {
                        id: person['_id'],
                        name: person['_source']['name'],
                        email: person['_source']['email'],
                        type: 'customer'
                    }])
                }
            })
          });
    }, []);

    return (<>
        <MentionsInput
          value={value}
          onChange= {(event, newValue, newPlainTextValue, mentions) => {
            setValue(newValue);
            // console.log(employees);
            // console.log(customers);
          }}
          placeholder="Type anything, use the @ symbol to tag other users."
          className="mentions"
        >
          <Mention
            className="mentions__mention__employee"
            type="employee"
            markup="@[__display__](type1:__id__)"
            trigger="@"
            data={employees.map(user => ({
                id: user.id,
                display: `${user.name}(${user.type})`
              }))}
            style={{ backgroundColor: '#ffcccb'}}
          />
          <Mention
            className="mentions__mention__customer"
            type="customer"
            markup="@[__display__](type2:__id__)"
            trigger="@"
            data={customers.map(user => ({
                id: user.id,
                display: `${user.name}(${user.type})`
            }))}
            style={{ backgroundColor: '#ADD8E6' }}
          />
        </MentionsInput>

    </>)


}