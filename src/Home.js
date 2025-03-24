import './App.css';
import { useDispatch } from 'react-redux';
import { AddCart } from './redux/cartSystem';
import { useNavigate } from 'react-router-dom';
import FaceDetection from './FaceDetection';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = (data) => {
    dispatch(AddCart(data));
    navigate('/cart'); // Redirect to the desired route
};
  const fruits = [
    { id: 1, name: 'Pomegranate', price: 24, image: 'https://img.freepik.com/free-vector/beautiful-cosmetic-ad_23-2148471068.jpg' },
    { id: 2, name: 'Avocado', price: 53, image: 'https://img.freepik.com/free-photo/3d-rendering-retro-computer_23-2151004360.jpg' },
    { id: 3, name: 'Grapes', price: 65, image: 'https://cdn.pixabay.com/photo/2020/04/15/21/04/background-5048215_640.png' },
];

const FruitCard = ({ fruit }) => (
    <div className="border rounded-2xl shadow-lg p-4 text-center">
       <div style={{height:'300px'}}>
       <img src={fruit.image} alt={fruit.name} className="w-32 h-32 mx-auto mb-2" style={{height:'100%', width:'100%', objectFit:'cover'}} />
       </div>
       <div>
       <h2 className="text-xl font-semibold">{fruit.name}</h2>
        <p className="text-lg">Price: ${fruit.price}</p>
        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-2" onClick={()=>handleClick(fruit)}>Add to Cart</button>
       </div>
    </div>
);
  return (
    <div className="App">
     <div className="gap-4 p-4" style={{display:'flex',justifyContent:'center'}}>
            {fruits.map((fruit) => (
                <FruitCard key={fruit.id} fruit={fruit} />
            ))}
        </div>
        {/* <FaceDetection /> */}
    </div>
  );
}

export default Home;
