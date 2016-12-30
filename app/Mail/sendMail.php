<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class sendMail extends Mailable
{
    use Queueable, SerializesModels;
	
	/**
	* Phone number
	*/
	protected $phone_number;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($phone_number)
    {
        $this->phone_number = $phone_number;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.email_template')
                    ->with([
                        'phone_number' => $this->phone_number
                    ])
					->subject('Message from Pahoda Image Products website');;
    }
}
