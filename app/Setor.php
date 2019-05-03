<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Setor extends Model
{
    protected $table = 'wtg_setor';
    protected $primaryKey = 'setor_id';
    public $timestamps = false;
    protected $fillable = ['set_nome'];
}
