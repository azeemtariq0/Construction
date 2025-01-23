<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('expense_detail', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('expense_id', 40)->nullable();
            $table->string('expense_title', 255)->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('amount', 10, 0)->default(0);
            $table->tinyInteger('sort_order')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('order_detail');
    }
};
