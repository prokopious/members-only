import users from '../data/dat';

export default function Page3() {

    return (
        <div className="App">
          <div className="page-deets">
            <h2>Iterate over Array and display data</h2>
          </div>
    
          
          <div className="users">
            {users.map((user, index) => (
              <div key={index}>
                <h3>{user.name}</h3>
                <img src={user.src} />
                <p>{user.location}</p>
                <p>{user.car}</p>
              </div>
            ))}
          </div>
        
        </div>
      );

}