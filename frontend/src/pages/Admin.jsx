import {Outlet, Link} from  "react-router-dom";
export default function Admin() {
  return (
    <div>
      <aside>
        <h2>Salon Admin</h2>
        <nav>
          <ul>
            <li>
              <Link to="/admin/dashboard">Dashboard </Link>
            </li>
            <li>
              <Link to="/admin/appointment">
              AppointmentTable 
              </Link>
            </li>
            <li>
              <Link to="/admin/staff">Staff</Link>
            </li>
            <li>
              <Link to="/admin/Inventory">Inventory</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  )
}