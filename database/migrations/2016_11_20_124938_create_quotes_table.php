<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuotesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('guid', 20);
            $table->string('editor', 30);
            $table->string('cover_letter_position', 10)->default('bottom');
            $table->text('sales_rep_notes');
            $table->string('status', 20);
            $table->integer('user_id')->nullable();
            $table->string('quoted_devices')->nullable();
            $table->string('devices_desc', 5000)->nullable();
            $table->string('added_accessories')->nullable();
            $table->string('selected_accessories', 1000)->nullable();
            $table->string('prices', 2000)->nullable();
            $table->string('included_pages', 2000)->nullable();
            $table->string('custom_accessories', 5000)->nullable();
            $table->string('custom_descriptions', 5000)->nullable();
            $table->string('selected_custom_accessories', 1000)->nullable();
            $table->string('how_did_we_do', 1000)->nullable();
            $table->boolean('sum_up', 100)->nullable();
            $table->boolean('rates_options', 200)->nullable();
            $table->string('displayed_price', 100)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('quotes');
    }
}
