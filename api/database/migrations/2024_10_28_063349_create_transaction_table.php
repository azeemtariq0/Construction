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
        Schema::create('transactions', function (Blueprint $table) {
            $table->char('id', 40)->primary();
            $table->char('transaction_code', 40)->notNullable();
            $table->char('document_no', 40)->notNullable();
            $table->date('transaction_date')->nullable();
            $table->text('remarks')->nullable();
            $table->decimal('amount')->default(0);
            $table->tinyInteger('is_deleted')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->char('created_by', 40)->notNullable();
            $table->timestamp('updated_at')->nullable()->useCurrentOnUpdate();
            $table->char('updated_by', 40)->notNullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
};
