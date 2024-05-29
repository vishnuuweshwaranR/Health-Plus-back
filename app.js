//Install the required dependencies
const express = require('express');
const db = require('./dbConfig'); // Import the database configuration
const cors = require('cors');


const app = express();
//Initialize port number
const port = 5000;
app.use(cors());
app.use(express.json());

// Example route to test database connection
//Get data from doctors table
app.get('/doctor', async (req, res) => {
    try {
        const [rows, fields] = await db.query('SELECT * FROM doctors WHERE active_flag =false');
        res.json(rows);
    } catch (err) {
        console.error('Database query error: ', err);
        res.status(500).send('Database query failed');
    }
});
//Create new record in doctor table
app.post('/doctor', (req, res) => {
    const doctor = req.body;
    const sql = 'INSERT INTO doctors (first_name, last_name, specialization, phone_number, email, address, city, state, zip_code, date_of_birth, gender, years_of_experience,active_flag) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
    const values = [doctor.first_name, doctor.last_name, doctor.specialization, doctor.phone_number, doctor.email, doctor.address, doctor.city, doctor.state, doctor.zip_code, doctor.date_of_birth, doctor.gender, doctor.years_of_experience,doctor.active_flag];

    db.query(sql, values, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        else{
            res.json({ id: result.insertId, ...doctor });
        }
        
    });
  });

  //Update existing record in doctor table
  app.put('/doctor/:id', (req, res) => {
    const doctor = req.body;
    const { id } = req.params;
    db.query('UPDATE doctors SET ? WHERE doctor_id = ?', [doctor, id], (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json({ id, ...doctor });
    });
  });

 //Delete record in doctor table
 app.delete('/doctor/:id', (req, res) => {
    const { id } = req.params;
    db.query('UPDATE  doctors SET active_flag=true WHERE doctor_id = ?', id, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.sendStatus(204);
    });
  });
 
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
