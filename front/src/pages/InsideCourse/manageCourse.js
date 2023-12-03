import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './manageCourse.css';
import axios from 'axios';


const ManageCourse = () => {
  const navigate = useNavigate();
  const [weeks, setWeeks] = useState([]);
  const [lessonLinks, setLessonLinks] = useState(['']);
  const [assignmentLinks, setAssignmentLinks] = useState(['']);
  const [lessonTitles, setLessonTitles] = useState(['']);
  const [activeWeek, setActiveWeek] = useState(null);
  const [progress, setProgress] = useState(0);
  const [courseName, setCourseName] = useState('');
  const { courseId } = useParams();
  const [userType, setUserType] = useState('');
  const handleNavigate = (route) => {
    navigate(route);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/course-content/${courseId}/weeks`);
        setWeeks(response.data);
      } catch (error) {
        console.error('Error fetching weeks data:', error.response.data.error);
      }
    };

    fetchData();
    const fetchCourseDetails = async () => {
      try {
        const courseResponse = await axios.get(`/course/${courseId}`);
        setCourseName(courseResponse.data.name);
      } catch (error) {
        console.error('Error fetching course details:', error.response.data.error);
      }
    };

    fetchCourseDetails();
    const token = localStorage.getItem('jw_token');
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserType(decodedToken.userType);
    }

  }, [courseId]);


  const handleAddWeekData = async () => {
    try {
      const newWeekData = {
        weekNumber: weeks[activeWeek].weekNumber,
        lessons: lessonLinks.map((link, index) => ({ title: lessonTitles[index], link })),
        assignments: assignmentLinks.map((link) => ({ link, submissions: [] })),
      };

      // Make a POST request to add the new week data
      const response = await axios.post(`http://localhost:5000/course-content/${courseId}/weeks`, newWeekData);

      // Handle success - you can update state or perform other actions
      console.log('Week data added successfully:', response.data);

      // Show success alert
      alert('Added week data successfully!');
    } catch (error) {
      // Handle error
      console.error('Error adding week data:', error.response.data.error);

      // Show error alert
      alert('Error adding week data. Please try again.');
    }
  };
  const handleUpdateWeekData = async () => {
    try {
      const updatedWeekData = {
        lessons: lessonLinks.map((link, index) => ({ title: lessonTitles[index], link })),
        assignments: assignmentLinks.map((link) => ({ link, submissions: [] })),
      };

      // Make a PUT request to update the existing week data
      const response = await axios.put(`http://localhost:5000/course-content/${courseId}/weeks/${weeks[activeWeek]._id}`, updatedWeekData);

      // Handle success - you can update state or perform other actions
      console.log('Week data updated successfully:', response.data);

      // Show success alert
      alert('Updated week data successfully!');

      // Optionally, you can update the state with the new data if needed
      setLessonLinks(response.data.week.lessons.map((lesson) => lesson.link));
      setLessonTitles(response.data.week.lessons.map((lesson) => lesson.title));
      setAssignmentLinks(response.data.week.assignments.map((assignment) => assignment.link));
    } catch (error) {
      // Handle error
      console.error('Error updating week data:', error.response.data.error);

      // Show error alert
      alert('Error updating week data. Please try again.');
    }
  };




  const handleAddWeek = () => {
    const newWeekNumber = weeks.length + 1;
    setWeeks((prevWeeks) => [
      ...prevWeeks,
      { weekNumber: newWeekNumber, lessons: [], assignments: [] },
    ]);
    setActiveWeek(newWeekNumber - 1);
  };

  const handleAddLesson = () => {
    setLessonLinks((prevLessonLinks) => [...prevLessonLinks, '']);
    setLessonTitles((prevLessonTitles) => [...prevLessonTitles, '']);
  };

  const handleAddAssignment = () => {
    setAssignmentLinks((prevAssignmentLinks) => [...prevAssignmentLinks, '']);
  };

  const handleRemoveLesson = (index) => {
    setLessonLinks((prevLessonLinks) => [...prevLessonLinks.slice(0, index), ...prevLessonLinks.slice(index + 1)]);
    setLessonTitles((prevLessonTitles) => [...prevLessonTitles.slice(0, index), ...prevLessonTitles.slice(index + 1)]);
  };

  const handleRemoveAssignment = (index) => {
    setAssignmentLinks((prevAssignmentLinks) => [
      ...prevAssignmentLinks.slice(0, index),
      ...prevAssignmentLinks.slice(index + 1),
    ]);
  };

  const handleLessonLinkChange = (index, value) => {
    setLessonLinks((prevLessonLinks) => [
      ...prevLessonLinks.slice(0, index),
      value,
      ...prevLessonLinks.slice(index + 1),
    ]);
  };

  const handleAssignmentLinkChange = (index, value) => {
    setAssignmentLinks((prevAssignmentLinks) => [
      ...prevAssignmentLinks.slice(0, index),
      value,
      ...prevAssignmentLinks.slice(index + 1),
    ]);
  };

  const handleLessonTitleChange = (index, value) => {
    setLessonTitles((prevLessonTitles) => [
      ...prevLessonTitles.slice(0, index),
      value,
      ...prevLessonTitles.slice(index + 1),
    ]);
  };

  const toggleWeekDropdown = (weekIndex) => {
    setActiveWeek((prevActiveWeek) => (prevActiveWeek === weekIndex ? null : weekIndex));

    if (weekIndex !== activeWeek) {
      const selectedWeek = weeks[weekIndex];
      if (selectedWeek) {
        setLessonLinks(selectedWeek.lessons.map((lesson) => lesson.link));
        setLessonTitles(selectedWeek.lessons.map((lesson) => lesson.title));
        setAssignmentLinks(selectedWeek.assignments.map((assignment) => assignment.link));
      } else {
        // Clear the fields if no week is selected
        setLessonLinks(['']);
        setLessonTitles(['']);
        setAssignmentLinks(['']);
      }
    }
  };

  const isExistingWeek = activeWeek !== null && weeks[activeWeek] && weeks[activeWeek].lessons.length > 0;




  return (
    <div className="manage-course-container">
      {/* Sidebar */}
      <div className="sidebar">
        <a href="#" onClick={() => handleNavigate('/home')}>
          Home
        </a>
        <a href="#" onClick={() => handleNavigate('/taken-courses')}>
          Courses
        </a>

        {/* Rectangular Card */}
        <div className="info-card">
          <h3>Course Info</h3>
          <div className="progress-bar">
            <p>Progress: {progress.toFixed(2)}%</p>
            <br></br>
          </div>
          <h6>Course Expiry Date:</h6>
          <p> [Your Date]</p>
          <br></br>
          <h6>Course Handouts:</h6>
          <p> [Handout Link]</p>
          <br></br>
          <h6>Course Resources:</h6>
          <p><Link to="/resource" >
            Check Resources
          </Link></p>
        </div>



      </div>
      {/* Main Content */}
      <div className="main-content">
        {/* Course Name */}
        <div className="course-name">{courseName}</div>

        {/* Two Row Gap */}
        <br />
        <br />

        {/* Manage and Add Week */}
        <div className="manage-add-week">
          <div className="manage-course">Manage Course</div>
          {userType === 'INS' && (
          <button className="add-week-button" onClick={handleAddWeek}>
            Add Week
          </button>
          )}
        </div>

        {/* Week Sections */}
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="week-section">
            <button className="week-button" onClick={() => toggleWeekDropdown(weekIndex)}>
              Week {week.weekNumber}
            </button>

            {activeWeek === weekIndex && (
              <div className="dropdown-content">
                <div className="week-form">
                  <label>Week No:</label>
                  <span>{week.weekNumber}</span>

                  {isExistingWeek ? (
                    // Display existing data
                    <>
                      {week.lessons.length > 0 && (
                        <div className="lesson-input">
                          <label>Lessons:</label>
                          {week.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex}>
                              <p>Lesson Title: {lesson.title}</p>
                              <p>Lesson Link: {lesson.link}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {week.assignments.length > 0 && (
                        <div className="assignment-input">
                          <label>Assignments:</label>
                          {week.assignments.map((assignment, assignmentIndex) => (
                            <div key={assignmentIndex}>
                              <p>Assignment Link: {assignment.link}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      {userType === 'INS' && (
                      <button type="button" onClick={handleUpdateWeekData}>
                        Update Data
                      </button>
                      )}
                    </>
                  ) : (
                    // Display input fields for new data
                    <>
                      <div className="lesson-input">
                        <label>Lessons:</label>
                        {lessonLinks.map((lessonLink, index) => (
                          <div key={index}>
                            <input
                              type="text"
                              placeholder="Lesson Link"
                              value={lessonLink}
                              onChange={(e) => handleLessonLinkChange(index, e.target.value)}
                            />
                            <input
                              type="text"
                              placeholder="Lesson Title"
                              value={lessonTitles[index]}
                              onChange={(e) => handleLessonTitleChange(index, e.target.value)}
                            />
                            {index > 0 && (
                              <button type="button" onClick={() => handleRemoveLesson(index)}>
                                Remove Lesson
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={handleAddLesson}>
                          Add Lesson
                        </button>
                      </div>

                      <div className="assignment-input">
                        <label>Assignments:</label>
                        {assignmentLinks.map((assignmentLink, index) => (
                          <div key={index}>
                            <input
                              type="text"
                              placeholder="Assignment Link"
                              value={assignmentLink}
                              onChange={(e) => handleAssignmentLinkChange(index, e.target.value)}
                            />
                            {index > 0 && (
                              <button type="button" onClick={() => handleRemoveAssignment(index)}>
                                Remove Assignment
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={handleAddAssignment}>
                          Add Assignment
                        </button>
                      </div>

                      <button type="button" onClick={handleAddWeekData}>
                        Submit Week Data
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Rest of the Content */}
        {/* ... */}
      </div>
    </div>
  );
};

export default ManageCourse;
