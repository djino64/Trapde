import PaymentMethod from "./components/PaymentMethod";


export default function BookingPayment(){


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
text-[#0000AA]
dark:text-white
">

Paiement de la réservation

</h1>



<p className="
mt-3
text-gray-600
dark:text-gray-400
">

Sélectionnez votre méthode de paiement.

</p>



<div className="
max-w-xl
mt-8
">

<PaymentMethod />


</div>


</div>

)

}