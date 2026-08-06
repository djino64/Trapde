import { useState } from "react";
import PriceSummary from "./components/PriceSummary";


export default function BookingDetails(){


const service = {

title:"Appartement moderne",

price:60

};


const [start,setStart]=useState("");

const [end,setEnd]=useState("");

const [guests,setGuests]=useState(1);



return (

<div className="
min-h-screen
bg-gray-50
dark:bg-gray-950
p-8
">


<h1 className="
text-3xl
font-bold
dark:text-white
">

Finaliser votre réservation

</h1>



<div className="
grid
md:grid-cols-2
gap-8
mt-8
">


<div className="
bg-white
dark:bg-gray-900
p-6
rounded-2xl
shadow
">


<h2 className="
text-xl
font-bold
dark:text-white
">

{service.title}

</h2>



<label className="block mt-5">

Date arrivée

</label>


<input

type="date"

className="border p-3 rounded-xl w-full"

onChange={(e)=>setStart(e.target.value)}

/>



<label className="block mt-5">

Date départ

</label>


<input

type="date"

className="border p-3 rounded-xl w-full"

onChange={(e)=>setEnd(e.target.value)}

/>




<label className="block mt-5">

Nombre de personnes

</label>


<input

type="number"

min="1"

value={guests}

onChange={(e)=>setGuests(Number(e.target.value))}

className="
border
p-3
rounded-xl
w-full
"

/>



</div>




<PriceSummary

price={service.price}

start={start}

end={end}

/>


</div>


</div>


)

}