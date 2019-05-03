<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Cargo extends Model
{
    protected $primaryKey = 'cargo_id';
    protected $table = 'wtg_cargo';
    public $timestamps = false;
    protected $fillable = [
        'car_nome'
    ];
}
