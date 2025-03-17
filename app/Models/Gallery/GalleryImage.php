<?php

namespace App\Models\Image;

use App\Models\Character\Character;
use App\Models\Gallery\Gallery;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryImage extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = ['title', 'hash', 'extension', 'description', 'artist_name', 'artist_url'];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'gallery_images';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = true;

    /**
     * The roles that belong to the user.
     */
    public function gallery(): BelongsTo
    {
        return $this->belongsTo(Gallery::class);
    }

}
