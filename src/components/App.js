import React, { useEffect, useState } from 'react';
import '../App.css';
import listImage from '../assets/list.png';
import listImage1 from '../assets/down-arrow.png';
import l1 from '../assets/grey_dot.jpg';
import l2 from '../assets/profile.png';
import l3 from '../assets/exclm.png';
import todoIcon from '../assets/to do.png';
import inProgressIcon from '../assets/in progress.png';
import backlogIcon from '../assets/backlog.png';
import cancelledIcon from '../assets/cancelled.png';
import doneIcon from '../assets/done.png';
import lowIcon from '../assets/low.png';
import highIcon from '../assets/high.png';
import mediumIcon from '../assets/medium.png';
import urgentIcon from '../assets/urgent.png';

const App = () => {
  const [showDropdowns, setShowDropdowns] = useState(false);
  const [grouping, setGrouping] = useState(localStorage.getItem('grouping') || 'user');
  const [ordering, setOrdering] = useState(localStorage.getItem('ordering') || 'priority');
  const [groupedAndOrderedTickets, setGroupedAndOrderedTickets] = useState(
    JSON.parse(localStorage.getItem('groupedAndOrderedTickets')) || []
  );
  const [state, setState] = useState({
    data: {
      tickets: [],
      users: [],
    },
    showDropdowns: false,
    grouping: localStorage.getItem('grouping') || 'user',
    ordering: localStorage.getItem('ordering') || 'priority',
    groupedAndOrderedTickets: JSON.parse(localStorage.getItem('groupedAndOrderedTickets')) || [],
  });

  const groupIconMapping = {
    'Todo': todoIcon,
    'In progress': inProgressIcon,
    'Backlog': backlogIcon,
    'Cancelled': cancelledIcon,
    'Done': doneIcon,
    'Urgent': urgentIcon,
    'High': highIcon,
    'Medium': mediumIcon,
    'Low': lowIcon,
    'No priority': '', // we can use an empty string if no icon is available
  };

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setState((prevState) => ({
          ...prevState,
          data: data,
        }));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    fetch('https://api.quicksell.co/v1/internal/frontend-assignment/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((users) => {
        setState((prevState) => ({
          ...prevState,
          data: {
            ...prevState.data,
            users: users,
          },
        }));
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const toggleDropdowns = () => {
    setShowDropdowns((prevState) => !prevState);
  };

  const mapPriorityLabel = (priority) => {
    switch (priority) {
      case 4:
        return 'Urgent';
      case 3:
        return 'High';
      case 2:
        return 'Medium';
      case 1:
        return 'Low';
      default:
        return 'No priority';
    }
  };

  useEffect(() => {
    const groupAndOrderTickets = () => {
      let grouped = {};

      state.data.tickets.forEach((ticket) => {
        let groupKey;

        if (grouping === 'user') {
          const userMapping = {
            'usr-1': 'Anoop Sharma',
            'usr-2': 'Yogesh',
            'usr-3': 'Shankar Kumar',
            'usr-4': 'Ramesh',
            'usr-5': 'Suresh',
          };
          groupKey = userMapping[ticket.userId] || 'Unknown User';
        } else if (grouping === 'status') {
          const statusMapping = {
            'todo': 'Todo',
            'in progress': 'In progress',
            'cancelled': 'Cancelled',
            'backlog': 'Backlog',
            'done': 'Done',
          };
          groupKey = statusMapping[ticket.status] || 'Unknown Status';
        } else if (grouping === 'priority') {
          groupKey = mapPriorityLabel(ticket.priority);
        }

        if (!grouped[groupKey]) grouped[groupKey] = [];

        grouped[groupKey].push(ticket);
      });

      for (const groupKey in grouped) {
        if (ordering === 'priority') {
          grouped[groupKey].sort((a, b) => a.priority - b.priority);
        } else if (ordering === 'title') {
          grouped[groupKey].sort((a, b) => a.title.localeCompare(b.title));
        }
      }

      const flatData = Object.keys(grouped).flatMap((groupKey) => grouped[groupKey]);
      setGroupedAndOrderedTickets(flatData);
      localStorage.setItem('groupedAndOrderedTickets', JSON.stringify(flatData));
    };

    groupAndOrderTickets();
  }, [state.data, grouping, ordering]);

  useEffect(() => {
    localStorage.setItem('grouping', grouping);
    localStorage.setItem('ordering', ordering);
  }, [grouping, ordering]);
 
  const renderGroupedTickets = () => {
    const groupedTickets = {};

    groupedAndOrderedTickets.forEach((ticket) => {
      let groupKey;

      if (grouping === 'user') {
        groupKey = state.data.users.find((user) => user.id === ticket.userId)?.name || 'Unknown User';
      } else if (grouping === 'status') {
        groupKey = ticket.status || 'Unknown Status';
      } else if (grouping === 'priority') {
        groupKey = mapPriorityLabel(ticket.priority);
      }

      if (!groupedTickets[groupKey]) groupedTickets[groupKey] = [];

      groupedTickets[groupKey].push(ticket);
    });

    const renderGroupIcon = (groupName) => {
      const iconUrl = groupIconMapping[groupName];
      if (iconUrl) {
        return <img className="img2" src={iconUrl} alt={`Icon for ${groupName}`} />;
      }
      return null;
    };

 
    return (
      <div className="grouped-tickets">
        {Object.entries(groupedTickets).map(([group, tickets]) => (
          <div key={group} className="group">
        <div className="group-header">
          {renderGroupIcon(group)}
          {grouping ==='user' && <img className="img2" src={l2} alt="List icon" /> }
          <h3 style={{marginLeft:10}}>{group}</h3> <text style={{marginLeft:10}}>{tickets.length}</text>
        </div>
            {tickets.map((ticket) => (
              <div key={ticket.id} className="ticket">
                <div className="cont">
                  <span className="cam">{ticket.id}</span>
                  {grouping !== 'user' && (
                    <img className="img2" src={l2} alt="List icon" />
                  )}
                </div>
                <h4>
                  {ticket.title}  
                </h4>
                <div className="entry">
                  <img className="img4" src={l3} alt="List icon" />
                  <div className="ftr">
                    <img className="img2" src={l1} alt="List icon" />
                    <p>Feature Request</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="display" onClick={toggleDropdowns}>
        <div className="container">
          <img className="img1" src={listImage} alt="List icon" />
          <span className="disptex">Display</span>
          <img className="img1" src={listImage1} alt="List icon" />
        </div>
      </div>
      {showDropdowns && (
        <div className="dropdown-container">
          <div className="dropdown-menu">
            <div style={{ padding: 1 }}>
              <text style={{ color: 'grey' }}>Grouping</text>
              <select value={grouping} onChange={(e) => setGrouping(e.target.value)} style={{ marginLeft: 70, padding: 1, cursor: 'pointer' }}>
                <option value="user" style={{ cursor: 'pointer' }}>User</option>
                <option value="status" style={{ cursor: 'pointer' }}>Status</option>
                <option value="priority" style={{ cursor: 'pointer' }}>Priority</option>
              </select>
            </div>
            <div style={{ padding: 1 }}>
              <text style={{ color: 'grey' }}>Ordering </text>
              <select value={ordering} onChange={(e) => setOrdering(e.target.value)} style={{ marginLeft: 70, padding: 1, cursor: 'pointer' }}>
                <option value="priority" style={{ cursor: 'pointer' }}>Priority</option>
                <option value="title" style={{ cursor: 'pointer' }}>Title</option>
              </select>
            </div>
          </div>
        </div>
      )}
      {renderGroupedTickets()}
    </div>
  );
};

export default App;