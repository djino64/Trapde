import { useState } from "react";
import { Search } from "lucide-react";
import BookingCard from "./components/BookingCard";


const services = [
    {
        id:1,
        type:"Accommodation",
        title:"Appartement moderne",
        location:"Cap-Haïtien",
        price:60,
        unit:"nuit",
        rating:4.8,
        image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
    },

    {
        id:2,
        type:"Travel",
        title:"Transport Port-au-Prince → Cap-Haïtien",
        location:"Haïti",
        price:40,
        unit:"trajet",
        rating:4.6,
        image:"https://images.unsplash.com/photo-1544620347-c4fd4a3d5957"
    }

];


export default function BookingPage(){

const [search,setSearch]=useState("");

const filtered =
services.filter(item =>
item.title.toLowerCase()
.includes(search.toLowerCase())
);



return (<div className=" min-h-screen bg-gray-50 dark:bg-gray-950 p-6 ">


<h1 className=" text-3xl font-bold text-[#0000AA] dark:text-white ">Réserver sur TRAPDE </h1>


<p className="mt-2 text-gray-600 dark:text-gray-400">

Trouvez un logement, transport ou service.</p>



<div className="
mt-8
bg-white
dark:bg-gray-900
rounded-2xl
shadow
p-5
flex
gap-4
">


<div className="
flex
items-center
border
rounded-xl
px-3
flex-1
">


<Search size={20}/>


<input

placeholder="Rechercher..."

className="
p-3
outline-none
bg-transparent
w-full
"

value={search}

onChange={(e)=>setSearch(e.target.value)}

/>


</div>



<button

className="
bg-[#0000AA]
text-white
px-6
rounded-xl
"

>

Rechercher

</button>


</div>



<h2 className="
text-2xl
font-bold
mt-10
dark:text-white
">

Services disponibles

</h2>



<div className="
grid
md:grid-cols-3
gap-6
mt-5
">


{
filtered.map(service=>(

<BookingCard

key={service.id}

service={service}

/>

))
}


</div>


</div>

)

}