<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class sendNotification extends Mailable
{
    use Queueable, SerializesModels;
	
	/**
	* Phone number
	*/
	protected $phone_number;
	
	/**
	* Quote review
	*/
	protected $quote_review;
	
	/**
	* Sales rep
	*/
	protected $sales_rep;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($phone_number, $quote_review, $sales_rep)
    {
        $this->phone_number = $phone_number;
        $this->quote_review = $quote_review;
        $this->sales_rep = $sales_rep;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {	
		switch ($this->quote_review) {
			case 'needs':		
				return $this->view('emails.notification_template_declined')
							->with([
								'phone_number' => $this->phone_number,								
								'sales_rep' => $this->sales_rep
							])
							->subject('Message from Pahoda Image Products website');
				break;
			case 'perfect':				
			default:
				return $this->view('emails.notification_template_accepted')
							->with([
								'phone_number' => $this->phone_number,								
								'sales_rep' => $this->sales_rep
							])
							->subject('Message from Pahoda Image Products website');
				break;
		}
    }
}
