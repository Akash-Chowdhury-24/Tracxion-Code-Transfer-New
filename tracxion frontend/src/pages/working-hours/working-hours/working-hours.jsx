import { useContext, useEffect, useRef, useState } from "react";
import { globalContext } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import CommonLoader from "../../../Component/common-loader";
import CommonToggleSwitch from "../../../Component/common-toggle-switch";
import CommonInput from "../../../Component/common-input";
import "./working-hours.css";

function WorkingHours() {
  const { setPageTitle, setButtonList, setBreadcrumbs, setSubPageTitle } = useContext(globalContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Helper to map local data to API format
  const formatDataForApi = (data) => {
    const dayMap = {
      Mon: "monday",
      Tue: "tuesday",
      Wed: "wednesday",
      Thu: "thursday",
      Fri: "friday",
      Sat: "saturday",
      Sun: "sunday"
    };
    return data.map(day => ({
      day: dayMap[day.day],
      is_active: day.active,
      start_time: day.active ? day.startTime : null,
      end_time: day.active ? day.endTime : null
    }));
  };

  // Helper to map backend data to local UI format
  const backendToLocalFormat = (daysData) => {
    const dayMap = {
      monday: "Mon",
      tuesday: "Tue",
      wednesday: "Wed",
      thursday: "Thu",
      friday: "Fri",
      saturday: "Sat",
      sunday: "Sun"
    };
    if (!Array.isArray(daysData) || daysData.length === 0) {
      return [
        { day: "Mon", active: false, startTime: null, endTime: null },
        { day: "Tue", active: false, startTime: null, endTime: null },
        { day: "Wed", active: false, startTime: null, endTime: null },
        { day: "Thu", active: false, startTime: null, endTime: null },
        { day: "Fri", active: false, startTime: null, endTime: null },
        { day: "Sat", active: false, startTime: null, endTime: null },
        { day: "Sun", active: false, startTime: null, endTime: null },
      ];
    }
    return daysData.map(item => ({
      day: dayMap[item.day],
      active: !!item.is_active,
      startTime: item.start_time ? item.start_time.slice(0, 5) : null,
      endTime: item.end_time ? item.end_time.slice(0, 5) : null
    }));
  };

  const [data, setData] = useState([
    {
      day: "Mon",
      active: true,
      startTime: "09:00",
      endTime: "17:00"
    },
    {
      day: "Tue",
      active: true,
      startTime: "09:00",
      endTime: "17:00"
    },
    {
      day: "Wed",
      active: true,
      startTime: "09:00",
      endTime: "17:00"
    },
    {
      day: "Thu",
      active: true,
      startTime: "09:00",
      endTime: "17:00"
    },
    {
      day: "Fri",
      active: true,
      startTime: "09:00",
      endTime: "17:00"
    },
    {
      day: "Sat",
      active: false,
      startTime: "09:00",
      endTime: "17:00"
    },
    {
      day: "Sun",
      active: false,
      startTime: "09:00",
      endTime: "17:00"
    }
  ]);

  const [editing, setEditing] = useState(false);
  const [timeErrors, setTimeErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const dataRef = useRef(data);
  useEffect(() => { dataRef.current = data }, [data]);

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/working-hours`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('gg admin token'))}`,
          'Accept': 'application/json'
        },
      });
      const data = await response.json();
      console.log('Working Hours data:', data);
      if (data.status === 'success') {
        return data.data
      }
      return [];
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  useEffect(() => {
    setPageTitle('Working Hours');
    setBreadcrumbs([{ title: 'Working Hours', link: '/working-hours' }]);
    setSubPageTitle({});
    const fetching = async () => {
      setLoading(true);
      // const backendData = await fetchData();
      // setData(backendToLocalFormat(backendData));
      setLoading(false);
    }
    fetching();
  }, [])
  useEffect(() => {
    if (!editing) {
      setButtonList([
        {
          type: 'button',
          text: 'Holidays',
          onClick: () => { navigate('holidays') },
          backgroundColor: 'transparent',
          textColor: '#00A1F9',
          borderColor: '#00A1F9'
        },
        {
          type: 'button',
          text: 'Edit Working Hours',
          onClick: () => { setEditing(true) },
          backgroundColor: '#00A1F9',
          textColor: 'white',
          borderColor: '#00A1F9'
        }
      ])
    } else {
      setButtonList([
        {
          type: 'button',
          text: 'Cancel',
          onClick: () => { setEditing(false) },
          backgroundColor: 'transparent',
          textColor: '#2C2D33',
          borderColor: 'transparent'
        },
        {
          type: 'button',
          text: submitting ? 'Saving...' : 'Save',
          onClick: () => { handleEditWorkingHours() },
          backgroundColor: '#00A1F9',
          textColor: 'white',
          borderColor: '#00A1F9',
          disabled: submitting
        }
      ])
    }

  }, [editing, submitting])

  // Helper function to validate time logic
  const validateTimeLogic = (startTime, endTime) => {
    if (!startTime || !endTime) return true; // Allow empty times during editing
    return startTime < endTime;
  };

  // Convert "HH:MM" (24h) to "hh:MMAM/PM" (e.g., "14:05" -> "02:05PM")
  const to12Hour = (time) => {
    if (!time) return "";
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr, 10);
    if (Number.isNaN(hour) || !minuteStr) return "";
    const suffix = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const hh = hour < 10 ? `0${hour}` : `${hour}`;
    return `${hh}:${minuteStr}${suffix}`;
  };

  // Helper function to check if there are any time validation errors
  const hasTimeValidationErrors = () => {
    return Object.values(timeErrors).some(error => error);
  };

  const handleEditWorkingHours = async () => {
    // Validate all times before submitting
    const errors = {};
    data.forEach(day => {
      if (day.active && day.startTime && day.endTime) {
        errors[day.day] = !validateTimeLogic(day.startTime, day.endTime);
      }
    });

    setTimeErrors(errors);

    // Check if there are any validation errors
    if (Object.values(errors).some(error => error)) {
      return; // Don't submit if there are validation errors
    }

    try {
      setIsSaving(true);
      // Build payload in expected API format
      const dayMap = {
        Mon: "monday",
        Tue: "tuesday",
        Wed: "wednesday",
        Thu: "thursday",
        Fri: "friday",
        Sat: "saturday",
        Sun: "sunday"
      };
      const schedule = (dataRef.current || data).reduce((acc, day) => {
        const key = dayMap[day.day];
        const start = day.active && day.startTime && day.endTime ? to12Hour(day.startTime) : "";
        const end = day.active && day.startTime && day.endTime ? to12Hour(day.endTime) : "";
        acc[key] = { start, end };
        return acc;
      }, {});

      const user = JSON.parse(localStorage.getItem('tracxion user'));

      console.log("Sending data", {
        schedule: schedule,
        user: user.role,
      })
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/editworkinghours`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('gg admin token'))}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          schedule: schedule,
          user: user.role,
        })
      });
      const result = await response.json();
      console.log('Working Hours edited:', result);
      if (result.status === 200) {
        setEditing(false);
        setTimeErrors({}); // Clear errors on success
      }
    } catch (error) {
      console.log('Error editing working hours:', error);
    }
    setIsSaving(false);
    setSubmitting(false);
  }

  if (loading) {
    return <CommonLoader text="Loading working hours..." />;
  }
  return (
    <div>
      {/* Time validation warning */}
      {editing && hasTimeValidationErrors() && (
        <div style={{
          color: '#d32f2f',
          fontSize: '14px',
          marginTop: '8px',
          marginBottom: '16px',
          padding: '8px 12px',
          backgroundColor: '#ffebee',
          borderRadius: '4px',
          border: '1px solid #ffcdd2'
        }}>
          ⚠️ Warning: End time must be after start time for all active days
        </div>
      )}
      <div className="working-hours-day-container">
        {
          data.map((day, index) => (
            <div className="working-hours-day-item" key={index}>
              <h1>
                {day.day}
              </h1>
              {
                editing &&
                <CommonToggleSwitch
                  checked={day.active}
                  onChange={(e) => {
                    const updatedDays = data.map((dayData) => {
                      if (dayData.day === day.day) {
                        const nextActive = !dayData.active;
                        return {
                          ...dayData,
                          active: nextActive,
                          startTime: nextActive ? (dayData.startTime ?? '') : '',
                          endTime: nextActive ? (dayData.endTime ?? '') : ''
                        }
                      }
                      return dayData;
                    });
                    setData(updatedDays);
                    dataRef.current = updatedDays;
                    // Clear any validation error for this day when toggled
                    setTimeErrors(prev => {
                      const next = { ...prev };
                      delete next[day.day];
                      return next;
                    });
                  }}
                />
              }
              {day.active &&
                <>
                  <div className="working-hours-time-input-container">
                    <CommonInput
                      type="time"
                      value={day.startTime}
                      name="startTime"
                      label="Start Time"
                      required
                      error={day.startTime === '' || timeErrors[day.day]}
                      errorMsg={day.startTime === '' ? "Start Time is required" : "Start time must be before end time"}
                      placeholder="Enter start time"
                      disabled={!editing}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        const updatedDays = data.map((dayData) => {
                          if (dayData.day === day.day) {
                            const updatedDay = { ...dayData, [name]: value };

                            // Validate time logic for this day
                            if (updatedDay.active && updatedDay.startTime && updatedDay.endTime) {
                              const isValid = validateTimeLogic(updatedDay.startTime, updatedDay.endTime);
                              setTimeErrors(prev => ({
                                ...prev,
                                [day.day]: !isValid
                              }));

                              // Clear warning if validation passes
                              if (isValid) {
                                setTimeErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors[day.day];
                                  return newErrors;
                                });
                              }
                            } else {
                              // Clear error if times are not both set
                              setTimeErrors(prev => ({
                                ...prev,
                                [day.day]: false
                              }));
                            }

                            return updatedDay;
                          }
                          return dayData;
                        });
                        setData(updatedDays);
                        dataRef.current = updatedDays;
                      }}
                      className="working-hours-time-input"
                      half
                    />
                  </div>
                  <div className="working-hours-time-input-container">
                    <CommonInput
                      type="time"
                      value={day.endTime}
                      name="endTime"
                      label="End Time"
                      required
                      error={day.endTime === '' || timeErrors[day.day]}
                      errorMsg={day.endTime === '' ? "End Time is required" : "End time must be after start time"}
                      placeholder="Enter end time"
                      disabled={!editing}
                      onChange={(e) => {
                        const { name, value } = e.target;
                        const updatedDays = data.map((dayData) => {
                          if (dayData.day === day.day) {
                            const updatedDay = { ...dayData, [name]: value };

                            // Validate time logic for this day
                            if (updatedDay.active && updatedDay.startTime && updatedDay.endTime) {
                              const isValid = validateTimeLogic(updatedDay.startTime, updatedDay.endTime);
                              setTimeErrors(prev => ({
                                ...prev,
                                [day.day]: !isValid
                              }));

                              // Clear warning if validation passes
                              if (isValid) {
                                setTimeErrors(prev => {
                                  const newErrors = { ...prev };
                                  delete newErrors[day.day];
                                  return newErrors;
                                });
                              }
                            } else {
                              // Clear error if times are not both set
                              setTimeErrors(prev => ({
                                ...prev,
                                [day.day]: false
                              }));
                            }

                            return updatedDay;
                          }
                          return dayData;
                        });
                        setData(updatedDays);
                        dataRef.current = updatedDays;
                      }}
                      className="working-hours-time-input"
                      half
                    />
                  </div>
                </>
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default WorkingHours;