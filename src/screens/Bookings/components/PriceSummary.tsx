interface Props{

price:number;

start:string;

end:string;

}


export default function PriceSummary({
price,
start,
end
}:Props){



let days=1;


if(start && end){

const difference =
new Date(end).getTime()
-
new Date(start).getTime();


days=Math.ceil(
difference /
(1000*3600*24)
);

}



const total=days*price;



return (

<div className="
bg-white
dark:bg-gray-900
rounded-2xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
dark:text-white
">

Résumé

</h2>



<div className="mt-5">

<p>
Prix par jour :
<b>
 {price} USD
</b>
</p>


<p>
Nombre de jours :
<b>
 {days}
</b>
</p>



<hr className="my-5"/>



<p className="
text-xl
font-bold
">

Total :
{total} USD

</p>



</div>



<button

className="
mt-6
w-full
bg-[#0000AA]
text-white
p-3
rounded-xl
"

>

Continuer vers paiement

</button>



</div>

)

}