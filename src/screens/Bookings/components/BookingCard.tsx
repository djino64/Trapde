import { MapPin, Star } from "lucide-react";


interface Props{
service:any;
}



export default function BookingCard({service}:Props){


return (

<div className="
bg-white
dark:bg-gray-900
rounded-2xl
overflow-hidden
shadow
hover:shadow-lg
transition
">


<img

src={service.image}

className="
h-52
w-full
object-cover
"

/>



<div className="p-5">


<h3 className="
font-bold
text-xl
dark:text-white
">

{service.title}

</h3>



<div className="
flex
items-center
gap-2
text-gray-500
mt-2
">

<MapPin size={18}/>

{service.location}

</div>




<div className="
flex
items-center
gap-2
mt-3
">

<Star
size={18}
className="fill-orange-500"
/>

{service.rating}

</div>



<div className="
flex
justify-between
items-center
mt-5
">


<p className="
font-bold
text-lg
">

{service.price} USD

<span className="
text-sm
font-normal
text-gray-500
">

 / {service.unit}

</span>

</p>




<button

className="
bg-[#FF6600]
text-white
px-5
py-2
rounded-xl
hover:bg-orange-600
"

>

Réserver

</button>



</div>


</div>


</div>

)

}