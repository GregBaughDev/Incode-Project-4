const express = require('express');
const router = express.Router();
const db = require('../conn/conn');
const { v4: uuidv4 } = require('uuid');
const { redirectToLogin } = require('../middleware');



// TODO: [RD] Add schedule validation to avoid time clashes
// TODO: [RD] Add user confirmation before deletion
// TODO: [RD] Tune Sort functionality for each column and say on correct page after deletion.


router
  .route('/')
  .get(redirectToLogin, (req, res) => {
    db.any(`SELECT * FROM schedules LEFT JOIN users ON schedules.user_id = users.user_id WHERE schedules.user_id = $1;`, [req.session.userID])
      .then((schedule) => {
        res.render('schedules', { schedule });
      })
      .catch((e) => {
        console.log(e);
      });
  })
// Add Schedule
  .post((req, res) => {
    db.any(`SELECT * FROM schedules WHERE schedules.user_id = $1 and schedules.day = $2 and schedules.start_time < $4
    AND (schedules.end_time IS NULL OR schedules.end_time > $3);`, [req.session.userID, req.body.day, req.body.start_time, req.body.end_time ])
    .then((dayExists) => {
      let validShift = null
      !dayExists[0] ? validShift = true : validShift = false
      if (validShift){
        db.none('INSERT INTO schedules(schedule_id, user_id, day, start_time, end_time) VALUES($1, $2, $3, $4, $5);',[uuidv4(), req.session.userID, req.body.day, req.body.start_time, req.body.end_time,])
        .then(() => {
          res.redirect('/schedules');
        })
  
        .catch((e) => {
          console.log(e);
        });
      }
      else{
        console.log("Invalid new shift")
      }
    })
    .catch((e) => {
      console.log(e);
    });
})

// Sort Schedule  
router
  .get('/day', redirectToLogin, (req, res) => {
    db.any(`SELECT * FROM schedules WHERE schedules.user_id = $1;`, [req.session.userID])
      .then((schedule) => {
        let daysortedSched = schedule.slice().sort((a, b) => a.day - b.day);
        let timesortedSched = daysortedSched.slice().sort((a, b) => parseInt(a.start_time) - parseInt(b.start_time));
        res.render('schedules', { schedule: timesortedSched });
      })
      .catch((e) => {
        console.log(e);
      });
  })

// Delete Specific Schedule Route
router
  .route('/:id/delete')
  .delete(async (req, res) => {
        const {id} = req.params
        try {
            const deletedSched = await db.any("SELECT * FROM schedules WHERE schedule_id = $1", [id])
            if (req.session.userID == deletedSched[0].user_id) { 
              db.none('DELETE FROM schedules WHERE schedule_id=$1', [id]);
              res.redirect('/schedules');
            }
            else {
              console.log("You cannot delete someone else's schedule!")
            }
        } catch (e) {
            console.log(e)
        }
    })

module.exports = router;
