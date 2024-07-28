//* Server side component *//
import { Metadata } from 'next';
import Login from './login/page';
 
export const metadata: Metadata = {
  title: 'Project Managment App',
  description: 'ANG Consultants PM App'
};

export default function Home() {
  
  return (
    <main>
      <div>
        <Login />
      </div>
    </main>
  )
}
